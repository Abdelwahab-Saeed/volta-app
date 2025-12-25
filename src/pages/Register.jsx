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
  FieldDescription,
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
import { UserPlus } from "lucide-react"
import { Link } from "react-router-dom"

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

    phoneNumber: z
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

    confirmPassword: z.string(),

    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'يجب الموافقة على الشروط والأحكام',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });


export default function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      terms: false,
    }
  })

  function onSubmit(values) {
    try {
      console.log(values);
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Form {...form}>
      <div className="min-h-screen w-10/12 border-2 my-10 mx-auto flex flex-col justify-center bg-white shadow-2xl py-12 px-4 sm:px-6 lg:w-4/12 lg:px-16">
        
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex gap-3 items-center">
              <UserPlus size={24} className="text-secondary" />
              <h1 className="text-2xl font-bold text-primary mb-2">تسجيل حساب</h1>
            </div>
            <p className="text-primary leading-10 mx-8">
            ستُستخدم بياناتك الشخصية لتحسين تجربتك على الموقع، وتسهيل الوصول إلى حسابك.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mx-8 pl-16">
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
                  {...form.register("phoneNumber")}
                />
                <FieldError className="text-red-500 text-sm mt-1">
                  {form.formState.errors.phoneNumber?.message}
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
                <FieldLabel htmlFor="confirmPassword" className="text-primary font-medium">
                  تأكيد كلمة المرور
                </FieldLabel>
                <Input 
                  id="confirmPassword" 
                  placeholder="تأكيد كلمة المرور"
                  className="mt-1 p-6"
                  type="password"
                  {...form.register("confirmPassword")}
                />
                <FieldError className="text-red-500 text-sm mt-1">
                  {form.formState.errors.confirmPassword?.message}
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
              className="w-full py-6 bg-primary text-white font-medium "
            >
               تسجيل
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
  )
}
