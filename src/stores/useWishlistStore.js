import { create } from 'zustand';
import * as wishlistApi from '../api/wishlist.api';
import { toast } from 'sonner';

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
            toast.success(response.data?.message || (isInWishlist ? 'تم الحذف من قائمة الأمنيات' : 'تمت الإضافة لقائمة الأمنيات'));
        } catch (error) {
            // Rollback on error
            set({ wishlistItems });
            const message = error.response?.data?.message || 'فشل تحديث قائمة الأمنيات';
            toast.error(message);
            throw error;
        }
    },

    isInWishlist: (productId) => {
        return get().wishlistItems.some(item => item.id === productId);
    },

    clearWishlist: () => set({ wishlistItems: [] })
}));
