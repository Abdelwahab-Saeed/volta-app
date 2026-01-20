import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAddressStore } from '@/stores/useAddressStore';
import { toast } from 'sonner';

export default function AddressForm({ open, onClose, onSuccess, initialData }) {
  const { t } = useTranslation();
  const { addNewAddress, updateUserAddress } = useAddressStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: '',
    phone_number: '',
    city: '',
    state: '',
    address_line_1: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipient_name: initialData.recipient_name || '',
        phone_number: initialData.phone_number || '',
        city: initialData.city || '',
        state: initialData.state || '',
        address_line_1: initialData.address_line_1 || '',
      });
    } else {
      setFormData({
        recipient_name: '',
        phone_number: '',
        city: '',
        state: '',
        address_line_1: '',
      });
    }
  }, [initialData, open]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        const response = await updateUserAddress(initialData.id, {
          ...formData,
          country: 'Egypt',
          zip_code: '',
        });
        toast.success(response.data?.message || t('address.success_save'));
      } else {
        const response = await addNewAddress({
          ...formData,
          country: 'Egypt',
          zip_code: '',
        });
        toast.success(response.data?.message || t('address.success_save'));
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save address", error);
      const message = error.response?.data?.message || t('address.failed_save');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {initialData ? t('address.edit_title') : t('address.add_new')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('checkout.full_name')}
            </label>
            <input
              type="text"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('checkout.phone')}
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('checkout.state')}
            </label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange('state', value)}
            >
              <SelectTrigger
                size="lg"
                className="w-full rounded-md py-3"
              >
                <SelectValue placeholder={t('address.select_state')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="القاهرة">{t('checkout.cairo', { defaultValue: 'Cairo' })}</SelectItem>
                <SelectItem value="الجيزة">{t('checkout.giza', { defaultValue: 'Giza' })}</SelectItem>
                <SelectItem value="الفيوم">{t('checkout.fayoum', { defaultValue: 'Fayoum' })}</SelectItem>
                <SelectItem value="بني سويف">{t('checkout.beni_suef', { defaultValue: 'Beni Suef' })}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('checkout.city')}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={t('checkout.city_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('checkout.address')}
            </label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              placeholder={t('checkout.address_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              {t('address.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {loading ? t('address.saving') : t('address.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
