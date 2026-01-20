import { create } from 'zustand';
import * as comparisonApi from '../api/comparison.api';
import { toast } from 'sonner';
import i18n from '@/i18n';

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
            toast.error(i18n.t('messages.compare_full'));
            return;
        }

        try {
            const response = await comparisonApi.addToComparison(product.id);
            set({ comparisonItems: [...comparisonItems, product], error: null });
            toast.success(response.data?.message || i18n.t('messages.compare_added'));
        } catch (error) {
            const message = error.response?.data?.message || i18n.t('messages.compare_failed');
            if (error.response?.status === 422) {
                toast.error(message || i18n.t('messages.compare_full'));
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
            toast.success(response.data?.message || i18n.t('messages.compare_removed'));
        } catch (error) {
            const message = error.response?.data?.message || i18n.t('messages.compare_remove_failed');
            toast.error(message);
            throw error;
        }
    },

    isInComparison: (productId) => {
        return get().comparisonItems.some(item => item.id === productId);
    },

    clearComparison: () => set({ comparisonItems: [] })
}));
