import { create } from 'zustand';
import { getCategories } from '@/api/categories';

// Header and Home both mount on the first paint and both need the category
// list. Without a shared in-flight promise they fire the same request twice.
let inFlight = null;

export const useCategoryStore = create((set, get) => ({
    categories: [],
    // Starts true: the very first render happens before the request resolves,
    // and consumers need to know to reserve space rather than render empty.
    loading: true,
    error: null,

    fetchCategories: async () => {
        if (get().categories.length > 0) return get().categories;
        if (inFlight) return inFlight;

        set({ loading: true, error: null });

        inFlight = (async () => {
            try {
                const response = await getCategories();
                const items = response.data.data || response.data || [];
                set({ categories: items, loading: false });
                return items;
            } catch (error) {
                set({ error: error.message, loading: false });
                console.error('Error fetching categories:', error);
                return [];
            } finally {
                inFlight = null;
            }
        })();

        return inFlight;
    },
}));
