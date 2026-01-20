import { create } from 'zustand';
import * as wishlistApi from '../api/wishlist.api';
import { toast } from 'sonner';
import i18n from '@/i18n';

export const useWishlistStore = create((set, get) => ({
    wishlistItems: [],
    isLoading: false,
    error: null,

    fetchWishlist: async () => {
        set({ isLoading: true });
        try {
            const response = await wishlistApi.getWishlist();
            set({ wishlistItems: response.data.data || [], isLoading: false, error: null });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    toggleWishlist: async (product) => {
        const { wishlistItems } = get();
        const isInWishlist = wishlistItems.some(item => item.id === product.id);

        // Optimistic update
        if (isInWishlist) {
            set({ wishlistItems: wishlistItems.filter(item => item.id !== product.id) });
        } else {
            set({ wishlistItems: [...wishlistItems, product] });
        }

        try {
            const response = await wishlistApi.toggleWishlist(product.id);
            toast.success(response.data?.message || (isInWishlist ? i18n.t('messages.wishlist_removed') : i18n.t('messages.wishlist_added')));
        } catch (error) {
            // Rollback on error
            set({ wishlistItems });
            const message = error.response?.data?.message || i18n.t('messages.failed_to_update_wishlist');
            toast.error(message);
            throw error;
        }
    },

    isInWishlist: (productId) => {
        return get().wishlistItems.some(item => item.id === productId);
    },

    clearWishlist: () => set({ wishlistItems: [] })
}));
