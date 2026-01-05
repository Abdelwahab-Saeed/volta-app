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
import { UserPlus, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"
import { useState } from "react"

export const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'الاسم يجب ألا يقل عن ثلاثة أحرف')
      .max(150, 'الاسم يجب ألا يزيد عن 150 حرف'),

    email: z
      .email('البريد الإلكتروني غير صحيح')
      .trim(),

    phone_number: z
      .string()
      .trim()
      .regex(/^01[0-2,5][0-9]{8}$/, 'رقم الهاتف غير صحيح')
      .optional(),

    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/,
        'كلمة المرور ضعيفة حيث يجب أن تحتوي على حرف كبير وحرف صغير ورمز خاص'
      ),

    password_confirmation: z.string(),

    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'يجب الموافقة على الشروط والأحكام',
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['password_confirmation'],
  });


export default function Register() {
  const registerUser = useAuthStore((state) => state.registerUser);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await registerUser(values);
      navigate('/');
    } catch (error) {
      console.error("Registration error", error);
      const message = error.response?.data?.message || 'حدث خطأ في التسجيل';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8 text-right" dir="rtl">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">تسجيل حساب جديد</h1>
          <div className="flex gap-2 text-base md:text-lg text-primary">
            <span>الرئيسية</span>
            <span>/</span>
            <span>تسجيل</span>
          </div>
        </div>
      </div>
      <Form {...form}>
        <div className="w-full max-w-xl border-2 my-10 mx-auto flex flex-col justify-center bg-white shadow-2xl py-12 px-6 lg:px-16" dir="rtl">

          {/* Header Section */}
          <div className="mb-10">
            <div className="flex gap-3 items-center">
              <UserPlus size={24} className="text-secondary" />
              <h1 className="text-2xl font-bold text-primary mb-2">تسجيل حساب</h1>
            </div>
            <p className="text-primary leading-relaxed opacity-80">
              ستُستخدم بياناتك الشخصية لتحسين تجربتك على الموقع، وتسهيل الوصول إلى حسابك.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            {/* Personal Information Section */}

            <Field>
              <FieldLabel htmlFor="name" className="text-primary font-medium">
                الاسم بالكامل
              </FieldLabel>
              <Input
                id="name"
                placeholder="الاسم بالكامل"
                className="mt-1 p-6"
                {...form.register("name")}
              />
              <FieldError className="text-red-500 text-sm mt-1">
                {form.formState.errors.name?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="text-primary font-medium">
                البريد الإلكتروني
              </FieldLabel>
              <Input
                id="email"
                placeholder="البريد الإلكتروني"
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
                الهاتف (اختياري)
              </FieldLabel>
              <Input
                id="phoneNumber"
                placeholder="الهاتف"
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

            <Field>
              <FieldLabel htmlFor="password_confirmation" className="text-primary font-medium">
                تأكيد كلمة المرور
              </FieldLabel>
              <Input
                id="password_confirmation"
                placeholder="تأكيد كلمة المرور"
                className="mt-1 p-6"
                type="password"
                {...form.register("password_confirmation")}
              />
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
                  أوافق على الشروط والأحكام وسياسة الخصوصية
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
                  جاري التسجيل...
                </>
              ) : (
                'تسجيل'
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-primary">
                هل لديك حساب بالفعل؟{" "}
                <Link
                  to="/login"
                  className="text-secondary hover:text-primary font-medium"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>

        </div>
      </Form>
    </>
  )
}
