import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"
import { useState, useEffect } from "react"

const formSchema = z.object({
    password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    password_confirmation: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
});

export default function ResetPassword() {
    const resetPasswordAction = useAuthStore((state) => state.resetPasswordAction);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [urlError, setUrlError] = useState(null);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setUrlError('رابط إعادة التعيين غير صالح أو منتهي الصلاحية.');
        }
    }, [token, email]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            password_confirmation: '',
        }
    })

    async function onSubmit(values) {
        setIsSubmitting(true);
        try {
            await resetPasswordAction({
                ...values,
                token,
                email
            });
            toast.success('تمت إعادة تعيين كلمة المرور بنجاح');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error("Reset password error", error);
            const message = error.response?.data?.message || 'فشلت عملية إعادة تعيين كلمة المرور';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const password = form.watch('password');
    const passwordStrength = {
        length: password?.length >= 8,
        hasUpper: /[A-Z]/.test(password || ''),
        hasNumber: /[0-9]/.test(password || ''),
    };

    if (urlError) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <XCircle size={64} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-primary mb-2">خطأ في الرابط</h2>
                <p className="text-primary opacity-80 mb-6">{urlError}</p>
                <Button onClick={() => navigate('/login')} className="bg-primary px-8 py-6">
                    العودة لتسجيل الدخول
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8 text-right" dir="rtl">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">تعيين كلمة المرور</h1>
                    <div className="flex gap-2 text-base md:text-lg text-primary">
                        <span>الرئيسية</span>
                        <span>/</span>
                        <span>تعيين كلمة المرور الجديدة</span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-lg border-2 my-10 mx-auto flex flex-col justify-center bg-white shadow-2xl py-12 px-6 lg:px-16" dir="rtl">
                <div className="mb-10">
                    <div className="flex gap-3 items-center">
                        <Lock size={24} className="text-secondary font-bold" />
                        <h1 className="text-2xl font-bold text-primary mb-2">كلمة مرور جديدة</h1>
                    </div>
                    <p className="text-primary leading-relaxed opacity-80">
                        الرجاء إدخال كلمة المرور الجديدة وتأكيدها.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                        <Field className="relative">
                            <FieldLabel htmlFor="password" title="password">
                                كلمة المرور الجديدة
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="********"
                                    className="mt-1 p-6"
                                    type={showPassword ? "text" : "password"}
                                    {...form.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50 hover:opacity-100"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <FieldError className="text-red-500 text-sm mt-1">
                                {form.formState.errors.password?.message}
                            </FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password_confirmation">
                                تأكيد كلمة المرور
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    placeholder="********"
                                    className="mt-1 p-6"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...form.register("password_confirmation")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50 hover:opacity-100"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <FieldError className="text-red-500 text-sm mt-1">
                                {form.formState.errors.password_confirmation?.message}
                            </FieldError>
                        </Field>

                        {/* Password strength checks */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                {passwordStrength.length ? <CheckCircle2 size={16} className="text-green-500" /> : <div className="w-4 h-4 border rounded-full" />}
                                <span className={passwordStrength.length ? "text-green-700" : "text-gray-500"}>8 أحرف على الأقل</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 bg-primary text-white font-medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                'حفظ كلمة المرور'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )
}
