import { useTranslation } from 'react-i18next';
import AddressCard from '../components/address/AddressCard';
import { Button } from '../components/ui/button';
import AddressForm from '../components/address/AddressForm';
import DeleteAddressModal from '../components/address/DeleteAddressModal';
import { useAddressStore } from '@/stores/useAddressStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function Address() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addresses, fetchAddresses, isLoading, deleteUserAddress } = useAddressStore();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddressSuccess = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteUserAddress(addressToDelete);
      toast.success(t('address.success_delete'));
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(t('address.failed_delete'));
    } finally {
      setDeleteLoading(false);
      setAddressToDelete(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {addresses.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-10">
              {t('address.no_addresses')}
            </div>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>
      )}

      <Button
        size="lg"
        className="mt-6 w-full max-w-md bg-secondary hover:bg-secondary/80 text-white text-lg rounded"
        onClick={() => {
          setEditingAddress(null);
          setIsFormOpen(true);
        }}
      >
        {t('address.add_new')}
      </Button>

      {isFormOpen && (
        <AddressForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAddress(null);
          }}
          onSuccess={handleAddAddressSuccess}
          initialData={editingAddress}
        />
      )}

      <DeleteAddressModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
