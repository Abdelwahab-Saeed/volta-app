import { create } from 'zustand';
import { getCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, updateCart as updateCartApi } from '@/api/cart.api';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';

export const useCartStore = create((set, get) => ({
    cartItems: [],
    cartLoading: false,

    fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            set({ cartItems: [] });
            return;
        }

        set({ cartLoading: true });
        try {
            const response = await getCart();
            const items = response.data.items || response.data.data || response.data || [];
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
            await addToCartApi({ product_id: product.id, quantity });
            toast.success('تم إضافة المنتج للسلة');
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

            await removeFromCartApi(cartItemId);
            toast.success('تم حذف المنتج من السلة');
            get().fetchCart();
        } catch (error) {
            console.error('Remove from cart error:', error);
            toast.error('فشل حذف المنتج من السلة');
            get().fetchCart(); // Revert
        }
    },

    isInCart: (productId) => {
        const { cartItems } = get();
        return cartItems.some(item => item.product_id === productId || item.id === productId);
    },

    clearCart: () => set({ cartItems: [] })
}));
