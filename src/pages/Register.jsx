import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const registerSchema = z.object({
  fullName: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  phone: z.string().optional(),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val, "يجب الموافقة على الشروط"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
})

export default function Register() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const onSubmit = (values) => {
    console.log(values)
    // handle registration
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex justify-center items-center gap-2">
            تسجيل حساب
            <span className="text-blue-600 text-lg">+</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            نستخدم بياناتك الشخصية لتحسين تجربتك على الموقع
            <br />
            وتسهيل الوصول إلى حسابك.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم بالكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="الاسم بالكامل" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="البريد الإلكتروني" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الهاتف (اختياري)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="الهاتف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="كلمة المرور" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="تأكيد كلمة المرور" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      أوافق على{" "}
                      <a href="#" className="text-blue-600 underline">
                        الشروط وسياسة الخصوصية
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" className="w-full">
              تسجيل
            </Button>
          </form>
        </Form>

        {/* Login link */}
        <p className="text-center text-sm mt-5 text-gray-600">
          هل لديك حساب بالفعل؟
          <a href="/login" className="text-blue-600 mr-1">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
