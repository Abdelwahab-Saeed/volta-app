import { create } from 'zustand';
import { getOrders } from '@/api/orders.api';

export const useOrderStore = create((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getOrders();
            const orders = response.data.data || [];
            set({ orders: Array.isArray(orders) ? orders : [] });
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({ error: 'Fails to fetch orders' });
        } finally {
            set({ isLoading: false });
        }
    }
}));
