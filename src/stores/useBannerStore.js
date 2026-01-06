import { create } from 'zustand';
import { getBanners } from '@/api/banners.api';

export const useBannerStore = create((set) => ({
    banners: [],
    loading: false,
    error: null,

    fetchBanners: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getBanners();
            // Assuming the standard structure based on useProductStore
            const resData = response.data.data;
            const items = Array.isArray(resData) ? resData : (resData?.items || []);

            set({ banners: items });
        } catch (error) {
            set({ error: error.message });
            console.error('Error fetching banners:', error);
        } finally {
            set({ loading: false });
        }
    },
}));
