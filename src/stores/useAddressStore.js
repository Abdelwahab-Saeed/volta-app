import { create } from 'zustand';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '@/api/addresses.api';
import { toast } from 'sonner';

export const useAddressStore = create((set, get) => ({
    addresses: [],
    isLoading: false,
    error: null,

    fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getAddresses();
            const addresses = response.data.data || [];
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
            const newAddress = response.data.data;
            if (newAddress) {
                set((state) => ({ addresses: [...state.addresses, newAddress] }));
            } else {
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
            const updatedAddress = response.data.data;

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
            const response = await deleteAddress(id);
            set((state) => ({
                addresses: state.addresses.filter((addr) => addr.id !== id)
            }));
            toast.success(response.data.message || 'تم حذف العنوان بنجاح');
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error(error.response?.data?.message || 'فشل حذف العنوان');
            throw error;
        }
    }
}));
