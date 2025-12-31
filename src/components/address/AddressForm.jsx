import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function AddressForm({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    secondaryPhone: '',
    city: '',
    area: '',
    street: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAddress = {
      id: Date.now(),
      name: formData.name,
      secondaryPhone: formData.secondaryPhone,
      fullAddress: `العنوان: ${formData.city} - ${formData.area} - ${formData.street}`,
    };
    onSubmit?.(newAddress);
    setFormData({
      name: '',
      phone: '',
      secondaryPhone: '',
      city: '',
      area: '',
      street: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            إضافة عنوان جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              الاسم بالكامل
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              رقم هاتف احتياطي
            </label>
            <input
              type="tel"
              name="secondaryPhone"
              value={formData.secondaryPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              المحافظة
            </label>
            <Select
              value={formData.city}
              onValueChange={(value) =>
                handleChange({ target: { name: 'city', value } })
              }
              className="w-full"
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
              المنطقة
            </label>
            <Select
              value={formData.area}
              onValueChange={(value) =>
                handleChange({ target: { name: 'area', value } })
              }
              className="w-full"
            >
              <SelectTrigger
                size="lg"
                className="w-full text-right rounded-md py-3"
              >
                <SelectValue placeholder="اختر المنطقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="صلاح سالم">صلاح سالم</SelectItem>
                <SelectItem value="عبد السلام عارف">عبد السلام عارف</SelectItem>
                <SelectItem value="مدينتي">مدينتي</SelectItem>
                <SelectItem value="التجمع الخامس">التجمع الخامس</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              العنوان
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              حفظ العنوان
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
