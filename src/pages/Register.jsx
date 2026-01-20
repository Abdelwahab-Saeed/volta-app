import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"
import {
  toast
} from "sonner"
import {
  Field,
  FieldLabel,
  FieldError,

} from "@/components/ui/field"
import {
  Button
} from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Checkbox
} from "@/components/ui/checkbox"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"
import { useState } from "react"
import { useTranslation } from "react-i18next";
import { Eye, UserPlus } from "lucide-react"

export default function Register() {
  const { t } = useTranslation();
  const registerUser = useAuthStore((state) => state.registerUser);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z
    .object({
      name: z
        .string()
        .trim()
        .min(3, t('checkout.full_name_required'))
        .max(150, 'Name is too long'),

      email: z
        .email(t('checkout.email_invalid'))
        .trim(),

      phone_number: z
        .string()
        .trim()
        .optional()
        .refine(
          (val) => !val || /^01[0-2,5][0-9]{8}$/.test(val),
          { message: t('checkout.phone_invalid') }
        ),

      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/,
          t('profile.password_too_short') // Or a more specific message if needed
        ),

      password_confirmation: z.string(),

      terms: z
        .boolean()
        .refine((val) => val === true, {
          message: t('auth.terms_required', { defaultValue: 'You must agree to the terms' }),
        }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t('profile.password_mismatch'),
      path: ['password_confirmation'],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      password: '',
      password_confirmation: '',
      terms: false,
    }
  })

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const response = await registerUser(values);
      toast.success(response.data?.message || t('messages.register_success', { defaultValue: 'Account created successfully' }));
      navigate('/');
    } catch (error) {
      console.error("Registration error", error);
      const message = error.response?.data?.message || t('common.error');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('auth.register_title')}</h1>
          <div className="flex gap-2 text-base md:text-lg text-primary">
            <Link to="/" className="hover:underline">{t('header.home')}</Link>
            <span>/</span>
            <span>{t('auth.register_title')}</span>
          </div>
        </div>
      </div>
      <Form {...form}>
        <div className="w-full max-w-xl border-2 my-10 mx-auto flex flex-col justify-center bg-white shadow-2xl py-12 px-6 lg:px-16">

          {/* Header Section */}
          <div className="mb-10">
            <div className="flex gap-3 items-center">
              <UserPlus size={24} className="text-secondary" />
              <h1 className="text-2xl font-bold text-primary mb-2">{t('auth.register_title')}</h1>
            </div>
            <p className="text-primary leading-relaxed opacity-80">
              {t('auth.privacy_notice')}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            {/* Personal Information Section */}

            <Field>
              <FieldLabel htmlFor="name" className="text-primary font-medium">
                {t('auth.name')}
              </FieldLabel>
              <Input
                id="name"
                placeholder={t('auth.name')}
                className="mt-1 p-6"
                {...form.register("name")}
              />
              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.name?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="text-primary font-medium">
                {t('auth.email')}
              </FieldLabel>
              <Input
                id="email"
                placeholder={t('auth.email')}
                className="mt-1 p-6"
                type="email"
                {...form.register("email")}
              />
              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.email?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="phoneNumber" className="text-primary font-medium">
                {t('auth.phone')} ({t('common.optional', { defaultValue: 'Optional' })})
              </FieldLabel>
              <Input
                id="phoneNumber"
                placeholder={t('auth.phone')}
                className="mt-1 p-6"
                {...form.register("phone_number")}
              />
              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.phone_number?.message}
              </FieldError>
            </Field>


            {/* Password Section */}

            <Field>
              <FieldLabel htmlFor="password" className="text-primary font-medium">
                {t('auth.password')}
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  placeholder={t('auth.password')}
                  className="mt-1 p-6"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-primary opacity-50 hover:opacity-100"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>


              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.password?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="password_confirmation" className="text-primary font-medium">
                {t('auth.confirm_password')}
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  placeholder={t('auth.confirm_password')}
                  className="mt-1 p-6"
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("password_confirmation")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-primary opacity-50 hover:opacity-100"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.password_confirmation?.message}
              </FieldError>
            </Field>

            {/* Terms and Conditions */}
            <div >
              <div className="flex flex-row items-center space-x-2 space-y-0">
                <Checkbox
                  id="terms"
                  className="mt-1"
                  checked={form.watch('terms')}
                  onCheckedChange={(val) => form.setValue('terms', !!val)}
                />

                <FieldLabel htmlFor="terms" className="text-primary font-medium cursor-pointer">
                  {t('auth.terms_and_privacy', { defaultValue: 'I agree to the terms and privacy policy' })}
                </FieldLabel>
              </div>
              <FieldError className="text-red-500 text-sm mt-2">
                {form.formState.errors.terms?.message}
              </FieldError>

            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 bg-primary text-white font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  {t('auth.registering')}
                </>
              ) : (
                t('auth.register_button')
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-primary">
                {t('auth.have_account')}{" "}
                <Link
                  to="/login"
                  className="text-secondary hover:text-primary font-medium"
                >
                  {t('auth.login_button')}
                </Link>
              </p>
            </div>
          </form>

        </div>
      </Form>
    </>
  )
}
