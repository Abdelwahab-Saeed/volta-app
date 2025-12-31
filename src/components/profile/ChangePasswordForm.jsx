import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async () => {
    try {
      // Call your API to update the profile
    } catch (error) {
      console.error('Error:', error);
      alert('فشل تغيير كلمة المرور. تأكد من كلمة المرور الحالية');
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
            {...register('currentPassword', {
              required: 'كلمة المرور الحالية مطلوبة',
              minLength: {
                value: 6,
                message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
              },
            })}
            className={`w-full p-3 border rounded text-right pr-12 ${
              errors.currentPassword ? 'border-red-500' : 'border-gray-300'
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
        {errors.currentPassword && (
          <p className="text-red-500 text-sm mt-1 text-right">
            {errors.currentPassword.message}
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
            {...register('newPassword', {
              required: 'كلمة المرور الجديدة مطلوبة',
              minLength: {
                value: 8,
                message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم',
              },
            })}
            className={`w-full p-3 border rounded text-right pr-12 ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300'
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
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1 text-right">
            {errors.newPassword.message}
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
            {...register('confirmPassword', {
              required: 'تأكيد كلمة المرور مطلوب',
              validate: (value) =>
                value === newPassword || 'كلمة المرور غير متطابقة',
            })}
            className={`w-full p-3 border rounded text-right pr-12 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
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
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 text-right">
            {errors.confirmPassword.message}
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
