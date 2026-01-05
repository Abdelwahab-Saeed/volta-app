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
        toast.success(response.data?.message || 'تم تحديث العنوان بنجاح');
      } else {
        const response = await addNewAddress({
          ...formData,
          country: 'Egypt',
          zip_code: '',
        });
        toast.success(response.data?.message || 'تم حفظ العنوان بنجاح');
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save address", error);
      const message = error.response?.data?.message || 'فشل حفظ العنوان';
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
            {initialData ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              الاسم بالكامل
            </label>
            <input
              type="text"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              الهاتف
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              المحافظة
            </label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange('state', value)}
            >
              <SelectTrigger
                size="lg"
                className="w-full text-right rounded-md py-3"
              >
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="القاهرة">القاهرة</SelectItem>
                <SelectItem value="الجيزة">الجيزة</SelectItem>
                <SelectItem value="الفيوم">الفيوم</SelectItem>
                <SelectItem value="بني سويف">بني سويف</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              المدينة / المنطقة
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="مثال: مدينة نصر"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              العنوان بالتفصيل
            </label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              placeholder="اسم الشارع - رقم العقار - رقم الشقة"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ العنوان'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
