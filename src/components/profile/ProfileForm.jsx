import { SwitchCamera, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

export default function ProfileForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const { user, updateUserProfile } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      date_of_birth: '',
      email: '',
      phone_number: '',
      image: null,
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone_number', user.phone_number || '');
      // Format date to YYYY-MM-DD for input type="date"
      const formattedDate = user.date_of_birth ? user.date_of_birth.split('T')[0] : '';
      setValue('date_of_birth', formattedDate);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      // Only append if value exists to support "nullable" and partial updates
      if (data.name) formData.append('name', data.name);
      if (data.date_of_birth) formData.append('date_of_birth', data.date_of_birth);
      if (data.email) formData.append('email', data.email);
      if (data.phone_number) formData.append('phone_number', data.phone_number);

      if (data.image?.[0]) {
        formData.append('image', data.image[0]);
      }

      await updateUserProfile(formData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحديث الملف الشخصي');
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
            ) : user?.image ? (
              <img
                src={`${import.meta.env.VITE_IMAGES_URL}/${user.image}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} />
            )}
          </div>
          <label
            htmlFor="image"
            className="absolute bottom-0 right-0 bg-secondary text-white rounded-full p-2 cursor-pointer hover:bg-opacity-90"
          >
            <SwitchCamera size={20} />
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            {...register('image')}
            onChange={(e) => {
              register('image').onChange(e);
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
            {...register('name', {
              required: false,
              minLength: {
                value: 3,
                message: 'الاسم يجب أن يكون 3 أحرف على الأقل',
              },
            })}
            className={`w-full p-3 border rounded text-right ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {errors.name.message}
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
              required: false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'البريد الإلكتروني غير صحيح',
              },
            })}
            className={`w-full p-3 border rounded text-right ${errors.email ? 'border-red-500' : 'border-gray-300'
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
            {...register('date_of_birth', { required: false })}
            className={`w-full p-3 border rounded text-right ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.date_of_birth && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {errors.date_of_birth.message}
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
            {...register('phone_number', {
              required: false,
              pattern: {
                value: /^[0-9]{11}$/,
                message: 'رقم الهاتف يجب أن يكون 11 رقم',
              },
            })}
            className={`w-full p-3 border rounded text-right ${errors.phone_number ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {errors.phone_number.message}
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
