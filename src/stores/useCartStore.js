import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, updateCart as updateCartApi } from '@/api/cart.api';
import { applyCoupon as applyCouponApi } from '@/api/coupons.api';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';
import i18n from '@/i18n';

// Helper to calculate bundle price for a single item
const calculateItemPrice = (item) => {
    const product = item.product;
    const quantity = item.quantity;

    if (product.bundle_offers && product.bundle_offers.length > 0) {
        // Find exact match bundle
        const bundle = product.bundle_offers.find(b => b.quantity === quantity && b.is_active);
        if (bundle) {
            return parseFloat(bundle.bundle_price); // This is the TOTAL for the bundle
        }
    }
    // Fallback to regular price * quantity
    return product.final_price * quantity;
};

export const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],
            cartLoading: false,
            coupon: null,
            discountAmount: 0,

            fetchCart: async () => {
                const { isAuthenticated } = useAuthStore.getState();

                if (!isAuthenticated) {
                    // For guests, we rely on persisted state, so we don't fetch from API
                    // But we could potentially validate stock here if needed in future
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
                } finally {
                    set({ cartLoading: false });
                }
            },

            addToCart: async (product, quantity = 1) => {
                const { isAuthenticated } = useAuthStore.getState();
                const productId = product.id;

                if (!productId) {
                    console.error('Attempted to add product without ID:', product);
                    return Promise.reject(new Error('Product ID is missing'));
                }

                if (!isAuthenticated) {
                    // Guest Logic
                    const { cartItems } = get();
                    const existingItemIndex = cartItems.findIndex(item => item.product_id === productId);

                    let updatedItems = [...cartItems];

                    if (existingItemIndex > -1) {
                        updatedItems[existingItemIndex] = {
                            ...updatedItems[existingItemIndex],
                            quantity: updatedItems[existingItemIndex].quantity + quantity
                        };
                    } else {
                        updatedItems.push({
                            id: `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Temp ID
                            product_id: productId,
                            quantity: quantity,
                            product: product
                        });
                    }

                    set({ cartItems: updatedItems });
                    toast.success(i18n.t('messages.added_to_cart'));
                    return Promise.resolve(true);
                }

                // Auth Logic
                try {
                    const response = await addToCartApi({ product_id: productId, quantity });
                    toast.success(response.data.message || i18n.t('messages.added_to_cart'));
                    get().fetchCart();
                    return Promise.resolve(true); // Indicate success
                } catch (error) {
                    console.error('Add to cart error:', error);
                    toast.error(i18n.t('messages.failed_to_add'));
                    return Promise.reject(error);
                }
            },

            updateCartItemQuantity: async (cartItemId, newQuantity) => {
                const { isAuthenticated } = useAuthStore.getState();
                const { cartItems } = get();

                if (!isAuthenticated) {
                    // Guest Logic
                    const updatedItems = cartItems.map(i =>
                        i.id === cartItemId ? { ...i, quantity: newQuantity } : i
                    );
                    set({ cartItems: updatedItems });
                    return;
                }

                // Auth Logic
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
                    toast.error(i18n.t('messages.failed_to_update'));
                    get().fetchCart(); // Revert
                }
            },

            removeFromCart: async (cartItemId) => {
                const { isAuthenticated } = useAuthStore.getState();
                const { cartItems } = get();

                if (!isAuthenticated) {
                    // Guest Logic
                    const newItems = cartItems.filter(
                        item => item.id !== cartItemId
                    );
                    set({ cartItems: newItems });
                    toast.success(i18n.t('messages.removed_from_cart'));
                    return;
                }

                // Auth Logic
                try {
                    // Optimistic update
                    const newItems = cartItems.filter(
                        item => item.id !== cartItemId && item.product_id !== cartItemId
                    );
                    set({ cartItems: newItems });

                    const response = await removeFromCartApi(cartItemId);
                    toast.success(response.data.message || i18n.t('messages.removed_from_cart'));
                    get().fetchCart();
                } catch (error) {
                    console.error('Remove from cart error:', error);
                    toast.error(i18n.t('messages.failed_to_remove'));
                    get().fetchCart(); // Revert
                }
            },

            isInCart: (productId) => {
                const { cartItems } = get();
                return cartItems.some(item => item.product_id === productId);
            },

            clearCart: () => set({ cartItems: [], coupon: null, discountAmount: 0 }),

            applyCoupon: async (code) => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) {
                    toast.error(i18n.t('messages.login_required_coupon'));
                    throw new Error('Login required');
                }

                const subtotal = get().getCartSubtotal();

                try {
                    const response = await applyCouponApi({ code, cart_total: subtotal });
                    const { message, data: resData } = response.data;

                    const discount_amount = resData?.discount_amount;
                    const couponData = resData?.coupon || resData;

                    set({
                        coupon: { ...couponData, code },
                        discountAmount: Math.min(Number(discount_amount || 0), subtotal)
                    });
                    toast.success(message || i18n.t('messages.coupon_applied', { code }));
                    return true;
                } catch (error) {
                    console.error('Apply coupon error:', error);
                    const msg = error.response?.data?.message || i18n.t('messages.failed_to_apply_coupon');
                    toast.error(msg);
                    set({ coupon: null, discountAmount: 0 });
                    throw error;
                }
            },

            removeCoupon: () => {
                set({ coupon: null, discountAmount: 0 });
                toast.info(i18n.t('messages.coupon_removed'));
            },

            getCartTotal: () => {
                const { cartItems, discountAmount } = get();
                // Calculate total based on bundle logic
                const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
                return Math.max(0, subtotal - discountAmount);
            },

            getCartSubtotal: () => {
                const { cartItems } = get();
                return cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
            },

            getItemPrice: (item) => calculateItemPrice(item)
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ cartItems: state.cartItems }), // Only persist items
        }
    )
);
