import { create } from 'zustand';
import * as comparisonApi from '../api/comparison.api';
import { toast } from 'sonner';

export const useComparisonStore = create((set, get) => ({
    comparisonItems: [],
    isLoading: false,
    error: null,

    fetchComparison: async () => {
        set({ isLoading: true });
        try {
            const response = await comparisonApi.getComparison();
            set({ comparisonItems: response.data.data || [], isLoading: false, error: null });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addToComparison: async (product) => {
        const { comparisonItems } = get();

        if (comparisonItems.length >= 2) {
            toast.error('قائمة المقارنة ممتلئة. الحد الأقصى هو منتجين فقط.');
            return;
        }

        try {
            const response = await comparisonApi.addToComparison(product.id);
            set({ comparisonItems: [...comparisonItems, product], error: null });
            toast.success(response.data?.message || 'تمت إضافة المنتج للمقارنة');
        } catch (error) {
            const message = error.response?.data?.message || 'فشل إضافة المنتج للمقارنة';
            if (error.response?.status === 422) {
                toast.error(message || 'قائمة المقارنة ممتلئة. الحد الأقصى هو منتجين فقط.');
            } else {
                toast.error(message);
            }
            throw error;
        }
    },

    removeFromComparison: async (productId) => {
        const { comparisonItems } = get();
        try {
            const response = await comparisonApi.removeFromComparison(productId);
            set({ comparisonItems: comparisonItems.filter(item => item.id !== productId) });
            toast.success(response.data?.message || 'تم حذف المنتج من المقارنة');
        } catch (error) {
            const message = error.response?.data?.message || 'فشل حذف المنتج من المقارنة';
            toast.error(message);
            throw error;
        }
    },

    isInComparison: (productId) => {
        return get().comparisonItems.some(item => item.id === productId);
    },

    clearComparison: () => set({ comparisonItems: [] })
}));
