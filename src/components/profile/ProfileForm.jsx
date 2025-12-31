import { SwitchCamera, User } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';

export default function ProfileForm() {
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      birthDate: '',
      email: '',
      phone: '',
      profileImage: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('birthDate', data.birthDate);
      formData.append('email', data.email);
      formData.append('phone', data.phone);

      if (data.profileImage?.[0]) {
        formData.append('profileImage', data.profileImage[0]);
      }

      // Call your API to update the profile
    } catch (error) {
      console.error('Error:', error);
      alert('فشل تحديث الملف الشخصي');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mx-auto"
      dir="rtl"
    >
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} />
            )}
          </div>
          <label
            htmlFor="profileImage"
            className="absolute bottom-0 right-0 bg-secondary text-white rounded-full p-2 cursor-pointer hover:bg-opacity-90"
          >
            <SwitchCamera size={20} />
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            {...register('profileImage')}
            onChange={(e) => {
              register('profileImage').onChange(e);
              handleImageChange(e);
            }}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-right mb-2 font-medium text-xl">
            الاسم بالكامل
          </label>
          <input
            type="text"
            placeholder="أدخل"
            {...register('fullName', {
              required: 'الاسم بالكامل مطلوب',
              minLength: {
                value: 3,
                message: 'الاسم يجب أن يكون 3 أحرف على الأقل',
              },
            })}
            className={`w-full p-3 border rounded text-right ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {errors.fullName.message}
            </p>
          )}
        </div>
        {/* Email */}
        <div>
          <label className="block text-right mb-2 font-medium text-xl">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            placeholder="Am1163@gmail.com"
            {...register('email', {
              required: 'البريد الإلكتروني مطلوب',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'البريد الإلكتروني غير صحيح',
              },
            })}
            className={`w-full p-3 border rounded text-right ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Birth Date */}
        <div>
          <label className="block text-right mb-2 font-medium text-xl">
            تاريخ الميلاد
          </label>
          <input
            type="date"
            placeholder="10/18/2003"
            {...register('birthDate', {
              required: 'تاريخ الميلاد مطلوب',
            })}
            className={`w-full p-3 border rounded text-right ${
              errors.birthDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {errors.birthDate.message}
            </p>
          )}
        </div>
        {/* Phone */}
        <div>
          <label className="block text-right mb-2 font-medium text-xl">
            الهاتف
          </label>
          <input
            type="tel"
            placeholder="01127574542"
            {...register('phone', {
              required: 'رقم الهاتف مطلوب',
              pattern: {
                value: /^[0-9]{11}$/,
                message: 'رقم الهاتف يجب أن يكون 11 رقم',
              },
            })}
            className={`w-full p-3 border rounded text-right ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-1/2 bg-secondary text-white py-3 rounded font-medium hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed text-xl h-auto"
        >
          {isSubmitting ? 'جاري التحديث...' : 'تحديث'}
        </Button>
      </div>
    </form>
  );
}
