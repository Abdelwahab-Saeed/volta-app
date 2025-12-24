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

const formSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phoneNumber: z.string().optional(),
  password: z.string(),
  confirmPassword: z.string(),
  conditions: z.boolean().default(true).optional()
});

export default function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),

  })

  function onSubmit(values ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
          <Field>
          <FieldLabel htmlFor="name">الاسم بالكامل</FieldLabel>
          <Input 
            id="name" 
            placeholder="الاسم بالكامل"
            
            {...form.register("name")}
          />
          
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>
                <Field>
          <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
          <Input 
            id="email" 
            placeholder="البريد الإلكتروني"
            
            {...form.register("email")}
          />
          
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </Field>
                <Field>
          <FieldLabel htmlFor="phoneNumber">الهاتف(إختياري)</FieldLabel>
          <Input 
            id="phoneNumber" 
            placeholder="الهاتف"
            {...form.register("phoneNumber")}
          />
          
          <FieldError>{form.formState.errors.phoneNumber?.message}</FieldError>
        </Field>
                <Field>
          <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
          <Input 
            id="password" 
            placeholder="كلمة المرور"
            {...form.register("password")}
          />
          
          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </Field>
                <Field>
          <FieldLabel htmlFor="confirmPassword">تأكيد كلمة المرور</FieldLabel>
          <Input 
            id="confirmPassword" 
            placeholder="Placeholder"
            {...form.register("confirmPassword")}
          />
          
          <FieldError>{form.formState.errors.confirmPassword?.message}</FieldError>
        </Field>
                <Field className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <Checkbox 
            id="conditions"
            
            {...form.register("conditions")}
          />
          <div className="space-y-1 leading-none">
            <FieldLabel htmlFor="conditions">أوافق على الشروط وسياسة الخصوصية</FieldLabel>
            
            <FieldError>{form.formState.errors.conditions?.message}</FieldError>
          </div>
        </Field>
              <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
