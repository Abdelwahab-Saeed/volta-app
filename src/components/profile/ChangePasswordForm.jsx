import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordForm() {
  const { t } = useTranslation();
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
      toast.success(t('profile.success_password'));
      reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('profile.failed_password'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      {/* Current Password */}
      <div>
        <label className="block mb-2 font-medium">
          {t('profile.current_password')}
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder={t('profile.current_password')}
            {...register('current_password', {
              required: t('profile.password_required'),
            })}
            className={`w-full p-3 border rounded px-12 ${errors.current_password ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.current_password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.current_password.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block mb-2 font-medium">
          {t('profile.new_password')}
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder={t('profile.new_password')}
            {...register('password', {
              required: t('profile.new_password_required'),
              minLength: {
                value: 8,
                message: t('profile.password_too_short'),
              },
              maxLength: {
                value: 255,
                message: 'Password too long'
              }
            })}
            className={`w-full p-3 border rounded px-12 ${errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block mb-2 font-medium">
          {t('profile.confirm_password')}
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('profile.confirm_password')}
            {...register('password_confirmation', {
              required: t('profile.confirm_password_required'),
              validate: (value) =>
                value === password || t('profile.password_mismatch'),
            })}
            className={`w-full p-3 border rounded px-12 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className="text-red-500 text-sm mt-1">
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
        {isSubmitting ? t('profile.updating') : t('profile.change_password')}
      </button>
    </form>
  );
}
