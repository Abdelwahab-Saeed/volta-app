import { create } from 'zustand';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '@/api/addresses.api';

export const useAddressStore = create((set, get) => ({
    addresses: [],
    isLoading: false,
    error: null,

    fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getAddresses();
            const addresses = response.data.addresses || response.data || [];
            set({ addresses: Array.isArray(addresses) ? addresses : [] });
        } catch (error) {
            console.error('Error fetching addresses:', error);
            set({ error: 'Fails to fetch addresses' });
        } finally {
            set({ isLoading: false });
        }
    },

    addNewAddress: async (data) => {
        try {
            const response = await addAddress(data);
            // Optimistically add the new address or re-fetch
            // Assuming response contains the created address in data.address or directly
            const newAddress = response.data.address || response.data;
            if (newAddress) {
                set((state) => ({ addresses: [...state.addresses, newAddress] }));
            } else {
                // If response format is unclear, refetch
                await get().fetchAddresses();
            }
            return response;
        } catch (error) {
            console.error("Error adding address:", error);
            throw error;
        }
    },

    updateUserAddress: async (id, data) => {
        try {
            const response = await updateAddress(id, data);
            const updatedAddress = response.data.address || response.data;

            if (updatedAddress) {
                set((state) => ({
                    addresses: state.addresses.map((addr) =>
                        addr.id === id ? { ...addr, ...updatedAddress } : addr
                    )
                }));
            } else {
                await get().fetchAddresses();
            }
            return response;
        } catch (error) {
            console.error("Error updating address:", error);
            throw error;
        }
    },

    deleteUserAddress: async (id) => {
        try {
            await deleteAddress(id);
            set((state) => ({
                addresses: state.addresses.filter((addr) => addr.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting address:", error);
            throw error;
        }
    }
}));
