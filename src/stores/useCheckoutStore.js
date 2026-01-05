import { create } from 'zustand';
import { checkout } from '@/api/orders.api';
import { useCartStore } from './useCartStore'; // To clear cart
import { toast } from 'sonner';

export const useCheckoutStore = create((set) => ({
    isLoading: false,
    error: null,
    success: false,
    orderData: null,

    reset: () => set({ isLoading: false, error: null, success: false, orderData: null }),

    submitOrder: async (data, navigate) => {
        set({ isLoading: true, error: null, success: false });
        try {
            const response = await checkout(data);
            set({ success: true, orderData: response.data.data?.order || response.data.data, isLoading: false });

            toast.success(response.data.message || 'تم إنشاء الطلب بنجاح');

            // Clear cart
            useCartStore.getState().clearCart();

            // Navigate to success page or orders page
            // navigate('/orders'); // Or pass navigate function
            if (navigate) navigate('/orders');

        } catch (error) {
            console.error("Checkout Error:", error);
            const errorData = error.response?.data;
            let errorMessage = 'فشل إنشاء الطلب';

            // Handle specific error structures
            if (errorData) {
                if (errorData.message) {
                    errorMessage = errorData.message;
                }

                // Stock errors
                if (errorData.product && errorData.available !== undefined) {
                    errorMessage = `مخزون غير كاف للمنتج ${errorData.product}. المتاح: ${errorData.available}`;
                }
            }

            set({ error: errorData, isLoading: false });
            toast.error(errorMessage);
            throw error; // Re-throw to let component handle specific field errors if needed
        }
    }
}));
