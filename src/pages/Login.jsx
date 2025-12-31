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
import { LockKeyhole, UserPlus, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export const formSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(1, 'البريد الإلكتروني أو الهاتف مطلوب'),

    password: z
      .string()
      .trim()
      .min(1, 'كلمة المرور مطلوبة'),

    remember: z
      .boolean()
      .default(false),
  });


export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',
      password: '',
      remember: false,
    }
  })

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      await loginUser(values);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/');
    } catch (error) {
      console.error("Login error", error);
      const message = error.response?.data?.message || 'حدث خطأ في تسجيل الدخول';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-light-background px-40 py-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-4">تسجيل الدخول</h1>
          <ul className="flex gap-2 text-lg text-primary px-2 list-disc mx-6">
            <li>الرئيسية تسجيل الدخول</li>
          </ul>
        </div>
      </div>
      <Form {...form}>
        <div className="w-full border-2 my-10 mx-auto flex flex-col justify-center bg-white shadow-2xl py-12 px-4 lg:w-4/12 lg:px-16">

          {/* Header Section */}
          <div className="mb-10">
            <div className="flex gap-3 items-center">
              <LockKeyhole size={24} className="text-secondary font-bold" />
              <h1 className="text-2xl font-bold text-primary mb-2">تسجيل الدخول إلى حسابك</h1>
            </div>
            <p className="text-primary leading-10 mx-8">
              ستُستخدم بياناتك الشخصية لتحسين تجربتك على الموقع، وتسهيل الوصول إلى حسابك.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mx-8 pl-16">

            <Field>
              <FieldLabel htmlFor="email" className="text-primary font-medium">
                البريد الإلكتروني أو الهاتف
              </FieldLabel>
              <Input
                id="email"
                placeholder="البريد الإلكتروني أو الهاتف"
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
                كلمة المرور
              </FieldLabel>
              <Input
                id="password"
                placeholder="كلمة المرور"
                className="mt-1 p-6"
                type="password"
                {...form.register("password")}
              />

              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.password?.message}
              </FieldError>
            </Field>

            {/* Remember Me */}
            <div >
              <div className="flex flex-row items-end space-x-2 space-y-0">
                <Checkbox
                  id="remember"
                  className="mt-1"
                  checked={form.watch('remember')}
                  onCheckedChange={(val) => form.setValue('remember', !!val)}
                />

                <FieldLabel htmlFor="remember" className="text-primary font-medium cursor-pointer">
                  تذكرني
                </FieldLabel>
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
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل'
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-primary">
                لا تمتلك حسابا؟
                <Link
                  to="/register"
                  className="text-secondary hover:text-primary font-medium"
                >
                  سجل الآن
                </Link>
              </p>
            </div>
          </form>

        </div>
      </Form>
    </>
  )
}
