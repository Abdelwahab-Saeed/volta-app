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
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { Eye, LockKeyhole } from "lucide-react"

export default function Login() {
  const { t } = useTranslation();
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z
    .object({
      identifier: z
        .string()
        .trim()
        .min(1, t('checkout.phone_required')),

      password: z
        .string()
        .trim()
        .min(1, t('profile.password_required')),

      remember: z
        .boolean()
        .default(false),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: localStorage.getItem('remembered_identifier') || '',
      password: '',
      remember: !!localStorage.getItem('remembered_identifier'),
    }
  })

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('remembered_identifier');
    if (savedIdentifier) {
      form.setValue('identifier', savedIdentifier);
      form.setValue('remember', true);
    }
  }, [form]);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const response = await loginUser(values);
      if (values.remember) {
        localStorage.setItem('remembered_identifier', values.identifier);
      } else {
        localStorage.removeItem('remembered_identifier');
      }
      toast.success(response.data?.message || t('messages.login_success', { defaultValue: 'Logged in successfully' }));
      navigate('/');
    } catch (error) {
      console.error("Login error", error);
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
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('auth.login_title')}</h1>
          <div className="flex gap-2 text-base md:text-lg text-primary">
            <Link to="/" className="hover:underline">{t('header.home')}</Link>
            <span>/</span>
            <span>{t('auth.login_title')}</span>
          </div>
        </div>
      </div>
      <Form {...form}>
        <div className="w-full max-w-lg border-2 my-10 mx-auto flex flex-col justify-center bg-white shadow-2xl py-12 px-6 lg:px-16">

          {/* Header Section */}
          <div className="mb-10">
            <div className="flex gap-3 items-center">
              <LockKeyhole size={24} className="text-secondary font-bold" />
              <h1 className="text-2xl font-bold text-primary mb-2">{t('auth.login_title')}</h1>
            </div>
            <p className="text-primary leading-relaxed opacity-80">
              {t('auth.privacy_notice')}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">

            <Field>
              <FieldLabel htmlFor="email" className="text-primary font-medium">
                {t('auth.email')}
              </FieldLabel>
              <Input
                id="email"
                placeholder={t('auth.email')}
                className="mt-1 p-6"
                type="text"
                {...form.register("identifier")}
              />
              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.identifier?.message}
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

            {/* Remember Me */}
            <div className="flex justify-between items-baseline">
              <div className="flex flex-row items-end space-x-2 space-y-0">
                <Checkbox
                  id="remember"
                  className="mt-1"
                  checked={form.watch('remember')}
                  onCheckedChange={(val) => form.setValue('remember', !!val)}
                />

                <FieldLabel htmlFor="remember" className="text-primary font-medium cursor-pointer">
                  {t('auth.remember_me')}
                </FieldLabel>
              </div>

              <div className="mt-2">
                <Link
                  to="/forgot-password"
                  className="text-secondary hover:text-primary text-sm font-medium"
                >
                  {t('auth.forgot_password')}
                </Link>
              </div>

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
                  {t('auth.logging_in')}
                </>
              ) : (
                t('auth.login_button')
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-primary">
                {t('auth.no_account')}{" "}
                <Link
                  to="/register"
                  className="text-secondary hover:text-primary font-medium"
                >
                  {t('auth.register_button')}
                </Link>
              </p>
            </div>
          </form>

        </div>
      </Form>
    </>
  )
}
