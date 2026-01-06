import { create } from 'zustand';
import { getCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, updateCart as updateCartApi } from '@/api/cart.api';
import { applyCoupon as applyCouponApi } from '@/api/coupons.api';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';

export const useCartStore = create((set, get) => ({
    cartItems: [],
    cartLoading: false,
    coupon: null,
    discountAmount: 0,

    fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            set({ cartItems: [] });
            return;
        }

        set({ cartLoading: true });
        try {
            const response = await getCart();
            const resData = response.data.data;
            const items = resData?.items || (Array.isArray(resData) ? resData : []);
            set({ cartItems: Array.isArray(items) ? items : [] });
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Don't clear items on error, just log it? Or maybe clear if it's a 401?
            // For now keeping existing behavior
        } finally {
            set({ cartLoading: false });
        }
    },

    addToCart: async (product, quantity = 1) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
            toast.error('يجب تسجيل الدخول لإضافة منتجات للسلة');
            return;
        }

        try {
            const response = await addToCartApi({ product_id: product.id, quantity });
            toast.success(response.data.message || 'تم إضافة المنتج للسلة');
            get().fetchCart();
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error('فشل إضافة المنتج للسلة');
        }
    },

    updateCartItemQuantity: async (cartItemId, newQuantity) => {
        const { cartItems } = get();
        try {
            // Optimistic update
            const updatedItems = cartItems.map(i =>
                i.id === cartItemId ? { ...i, quantity: newQuantity } : i
            );
            set({ cartItems: updatedItems });

            await updateCartApi(cartItemId, { quantity: newQuantity });
            get().fetchCart();
        } catch (error) {
            console.error('Update quantity error:', error);
            toast.error('فشل تحديث الكمية');
            get().fetchCart(); // Revert
        }
    },

    removeFromCart: async (cartItemId) => {
        const { cartItems } = get();
        try {
            // Optimistic update
            const newItems = cartItems.filter(
                item => item.id !== cartItemId && item.product_id !== cartItemId
            );
            set({ cartItems: newItems });

            const response = await removeFromCartApi(cartItemId);
            toast.success(response.data.message || 'تم حذف المنتج من السلة');
            get().fetchCart();
        } catch (error) {
            console.error('Remove from cart error:', error);
            toast.error('فشل حذف المنتج من السلة');
            get().fetchCart(); // Revert
        }
    },

    isInCart: (productId) => {
        const { cartItems } = get();
        return cartItems.some(item => item.product_id === productId);
    },

    clearCart: () => set({ cartItems: [], coupon: null, discountAmount: 0 }),

    applyCoupon: async (code) => {
        const { cartItems } = get();
        const subtotal = cartItems.reduce((sum, item) => sum + (item.product.final_price * item.quantity), 0);

        try {
            const response = await applyCouponApi({ code, cart_total: subtotal });
            const { message, data: resData } = response.data;

            // Extract from standard nested data field
            const discount_amount = resData?.discount_amount;
            const couponData = resData?.coupon || resData;

            set({
                coupon: { ...couponData, code },
                discountAmount: Math.min(Number(discount_amount || 0), subtotal)
            });
            toast.success(message || 'تم تطبيق الكوبون بنجاح');
            return true;
        } catch (error) {
            console.error('Apply coupon error:', error);
            const msg = error.response?.data?.message || 'فشل تطبيق الكوبون';
            toast.error(msg);
            set({ coupon: null, discountAmount: 0 });
            throw error;
        }
    },

    removeCoupon: () => {
        set({ coupon: null, discountAmount: 0 });
        toast.info('تم حذف الكوبون');
    },

    getCartTotal: () => {
        const { cartItems, discountAmount } = get();
        const subtotal = cartItems.reduce((sum, item) => sum + (item.product.final_price * item.quantity), 0);
        return Math.max(0, subtotal - discountAmount);
    },

    getCartSubtotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((sum, item) => sum + (item.product.final_price * item.quantity), 0);
    }
}));
