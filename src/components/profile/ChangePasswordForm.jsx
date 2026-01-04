import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

export default function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changeUserPassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      current_password: '', // Changed to match API requirement
      password: '',        // Changed to match API requirement
      password_confirmation: '', // Changed to match API requirement
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await changeUserPassword(data);
      toast.success('تم تغيير كلمة المرور بنجاح');
      reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تغيير كلمة المرور. تأكد من كلمة المرور الحالية');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
      dir="rtl"
    >
      {/* Current Password */}
      <div>
        <label className="block text-right mb-2 font-medium">
          كلمة المرور الحالية
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="أدخل كلمة المرور الحالية"
            {...register('current_password', {
              required: 'كلمة المرور الحالية مطلوبة',
            })}
            className={`w-full p-3 border rounded text-right pr-12 ${errors.current_password ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.current_password && (
          <p className="text-red-500 text-sm mt-1 text-right">
            {errors.current_password.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-right mb-2 font-medium">
          كلمة المرور الجديدة
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="أدخل كلمة المرور الجديدة"
            {...register('password', {
              required: 'كلمة المرور الجديدة مطلوبة',
              minLength: {
                value: 8,
                message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
              },
              maxLength: {
                value: 255,
                message: 'كلمة المرور طويلة جداً'
              }
            })}
            className={`w-full p-3 border rounded text-right pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 text-right">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-right mb-2 font-medium">
          تأكيد كلمة المرور
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="أعد إدخال كلمة المرور الجديدة"
            {...register('password_confirmation', {
              required: 'تأكيد كلمة المرور مطلوب',
              validate: (value) =>
                value === password || 'كلمة المرور غير متطابقة',
            })}
            className={`w-full p-3 border rounded text-right pr-12 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className="text-red-500 text-sm mt-1 text-right">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-secondary text-white py-3 rounded font-medium hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
      </button>
    </form>
  );
}
