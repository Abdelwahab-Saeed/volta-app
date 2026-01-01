import { create } from 'zustand';
import { getProducts, getProduct } from '@/api/products.api';

export const useProductStore = create((set) => ({
    products: [],
    pagination: null,
    selectedProduct: null,
    loading: false,
    error: null,

    fetchProducts: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getProducts(params);
            const data = response.data;

            // Handle API structure based on user request example
            if (data.data && data.pagination) {
                set({
                    products: data.data,
                    pagination: data.pagination
                });
            } else if (data.data) {
                // Fallback for Laravel default resource response or previous structure
                set({ products: data.data, pagination: data.meta || null });
            } else {
                set({ products: data, pagination: null });
            }
        } catch (error) {
            set({ error: error.message });
            console.error('Error fetching products:', error);
        } finally {
            set({ loading: false });
        }
    },

    fetchProductById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await getProduct(id);
            const productData = response.data.data || response.data;
            set({ selectedProduct: productData });
        } catch (error) {
            set({ error: error.message });
            console.error('Error fetching product:', error);
        } finally {
            set({ loading: false });
        }
    },

    clearSelectedProduct: () => set({ selectedProduct: null })
}));
