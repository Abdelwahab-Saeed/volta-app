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
            const resData = response.data.data;

            // Extract from standard items/pagination structure
            const items = resData?.items || (Array.isArray(resData) ? resData : []);
            const pagination = resData?.pagination || response.data.pagination;

            set({
                products: items,
                pagination: pagination || null
            });
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
            const productData = response.data.data;
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
