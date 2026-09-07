import { create } from 'zustand';
import { getBanners } from '@/api/banners.api';

// index.html kicks off GET /banners before this bundle has even finished
// downloading, and preloads the banner image as soon as the URL is known.
// Consume that result once, then fall back to a normal request.
const takePrefetched = async () => {
    if (typeof window === 'undefined' || !window.__voltaBanners) return null;

    const pending = window.__voltaBanners;
    window.__voltaBanners = null; // one-shot: a later refetch must hit the network

    try {
        const items = await pending;
        return Array.isArray(items) && items.length ? items : null;
    } catch {
        return null;
    }
};

export const useBannerStore = create((set) => ({
    banners: [],
    // Starts true so HomeCarousel renders its skeleton on the very first paint.
    // With false it returned null, then swapped to the skeleton a tick later -
    // inserting the banner box at the top of the page and shifting everything
    // below it.
    loading: true,
    error: null,

    fetchBanners: async () => {
        set({ loading: true, error: null });
        try {
            const prefetched = await takePrefetched();
            if (prefetched) {
                set({ banners: prefetched });
                return;
            }

            const response = await getBanners();
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
