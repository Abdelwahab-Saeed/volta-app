import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"
import { useState } from "react"
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const forgotPasswordAction = useAuthStore((state) => state.forgotPasswordAction);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const formSchema = z.object({
        email: z.string().trim().min(1, t('checkout.email_required')).email(t('checkout.email_invalid')),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        }
    })

    async function onSubmit(values) {
        setIsSubmitting(true);
        try {
            await forgotPasswordAction(values);
            setIsSent(true);
            toast.success(t('messages.recovery_sent', { defaultValue: 'Reset link sent successfully' }));
        } catch (error) {
            console.error("Forgot password error", error);
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
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('auth.forgot_password')}</h1>
                    <div className="flex gap-2 text-base md:text-lg text-primary">
                        <Link to="/" className="hover:underline">{t('header.home')}</Link>
                        <span>/</span>
                        <span>{t('auth.recovery_title')}</span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-lg border-2 my-10 mx-auto flex flex-col justify-center bg-white shadow-2xl py-12 px-6 lg:px-16">
                {isSent ? (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="bg-green-100 p-4 rounded-full">
                                <KeyRound size={48} className="text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-primary">{t('auth.check_email')}</h2>
                        <p className="text-primary opacity-80 leading-relaxed">
                            {t('auth.recovery_sent_msg')}
                        </p>
                        <Link to="/login" className="inline-flex items-center gap-2 text-secondary hover:text-primary font-medium">
                            <ArrowRight size={20} className="rtl:rotate-180" />
                            {t('auth.back_to_login')}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-10">
                            <div className="flex gap-3 items-center">
                                <KeyRound size={24} className="text-secondary font-bold" />
                                <h1 className="text-2xl font-bold text-primary mb-2">{t('auth.recovery_title')}</h1>
                            </div>
                            <p className="text-primary leading-relaxed opacity-80">
                                {t('auth.recovery_desc')}
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                                <Field>
                                    <FieldLabel htmlFor="email" className="text-primary font-medium">
                                        {t('auth.email')}
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        placeholder="example@mail.com"
                                        className="mt-1 p-6"
                                        type="email"
                                        {...form.register("email")}
                                    />
                                    <FieldError className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.email?.message}
                                    </FieldError>
                                </Field>

                                <Button
                                    type="submit"
                                    className="w-full py-6 bg-primary text-white font-medium"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                            {t('auth.sending')}
                                        </>
                                    ) : (
                                        t('auth.send_reset_link')
                                    )}
                                </Button>

                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-secondary hover:text-primary font-medium">
                                        {t('auth.back_to_login')}
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </>
                )}
            </div>
        </>
    )
}
