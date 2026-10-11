import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { GOVERNORATES } from '@/lib/governorates';
import { createDistributorRequest } from '@/api/distributors.api';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { cn } from '@/lib/utils';

const WHATSAPP_URL = 'https://wa.me/+201025021518';
const NOTES_MAX = 1000;
const FIELD_ORDER = ['name', 'phone', 'governorate', 'center', 'area', 'has_commercial_register', 'has_shop', 'notes'];

// "٠١٠ 1234-5678" -> "01012345678"
const normalizePhone = (value = '') =>
  value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\s\-().]/g, '')
    .replace(/^(\+20|0020)/, '0');

const fieldClass = (invalid) =>
  cn(
    'block h-12 w-full rounded-xl border bg-white px-4 text-base text-primary placeholder:text-slate-400 transition-colors',
    'focus:outline-none focus-visible:ring-4',
    invalid
      ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15'
      : 'border-slate-200 hover:border-slate-300 focus-visible:border-secondary focus-visible:ring-secondary/15',
  );

function Field({ id, label, hint, error, optional, children }) {
  const { t } = useTranslation();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-1 text-sm font-bold text-primary">
        {label}
        {optional ? (
          <span className="text-xs font-medium text-slate-400">({t('distributor.form.optional')})</span>
        ) : (
          <span aria-hidden="true" className="text-secondary">*</span>
        )}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-600">
          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* Yes/No as two big pill buttons. Real radios, so arrow keys and screen readers work as usual. */
function YesNo({ name, legend, register, error }) {
  const { t } = useTranslation();
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-1.5 flex items-baseline gap-1 text-sm font-bold text-primary">
        {legend}
        <span aria-hidden="true" className="text-secondary">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {[
          ['1', t('distributor.form.yes')],
          ['0', t('distributor.form.no')],
        ].map(([value, label]) => (
          <label key={value} className="group cursor-pointer">
            <input
              type="radio"
              value={value}
              id={value === '1' ? name : undefined}
              className="peer sr-only"
              {...register(name, { required: t('distributor.errors.choice_required') })}
            />
            <span
              className={cn(
                'flex h-12 items-center justify-center gap-2 rounded-xl border bg-white text-base font-bold text-slate-600 transition-colors',
                'hover:border-slate-300 peer-checked:border-secondary peer-checked:bg-secondary/10 peer-checked:text-primary',
                'peer-focus-visible:ring-4 peer-focus-visible:ring-secondary/15',
                error ? 'border-red-400' : 'border-slate-200',
              )}
            >
              <CheckCircle2 aria-hidden="true" className="hidden h-5 w-5 text-secondary group-has-checked:inline" />
              {label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-600">
          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** "Become a Volta distributor" form: validates on blur, lists problems at the top after a failed submit. */
export default function DistributorForm() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language?.startsWith('ar');
  const [submitted, setSubmitted] = useState(null);
  const summaryRef = useRef(null);
  const successRef = useRef(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, submitCount },
  } = useForm({
    mode: 'onTouched',
    shouldFocusError: false, // focus goes to the error summary instead
    defaultValues: { name: '', phone: '', governorate: '', center: '', area: '', notes: '', website: '' },
  });

  const notesLength = useWatch({ control, name: 'notes' })?.length ?? 0;
  const errorList = FIELD_ORDER.filter((key) => errors[key]).map((key) => ({ key, message: errors[key].message }));

  const focusSummary = () => requestAnimationFrame(() => summaryRef.current?.focus());

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      has_commercial_register: values.has_commercial_register === '1',
      has_shop: values.has_shop === '1',
    };
    try {
      await createDistributorRequest(payload);
      setSubmitted(values.phone);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (error) {
      const status = error.response?.status;
      const serverErrors = error.response?.data?.errors;
      if (status === 422 && serverErrors) {
        Object.entries(serverErrors).forEach(([key, messages]) => {
          if (FIELD_ORDER.includes(key)) setError(key, { type: 'server', message: messages[0] });
        });
        focusSummary();
      } else if (status === 429) {
        toast.error(t('distributor.errors.too_many'));
      } else {
        toast.error(t('distributor.errors.failed'));
      }
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center px-2 py-8 text-center">
        <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
          <CheckCircle2 aria-hidden="true" className="h-10 w-10" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="text-2xl font-black text-primary focus:outline-none">
          {t('distributor.success.title')}
        </h2>
        <p className="mt-3 max-w-md leading-relaxed text-slate-600">
          {t('distributor.success.text')} <bdi dir="ltr" className="font-bold text-primary">{submitted}</bdi>
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-white transition-colors hover:bg-primary/90"
          >
            <WhatsAppIcon size={20} />
            {t('distributor.success.whatsapp')}
          </a>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-slate-200 px-6 font-bold text-primary transition-colors hover:border-primary"
          >
            {t('distributor.success.home')}
          </Link>
        </div>
      </div>
    );
  }

  const describedBy = (key, hasHint) => (errors[key] ? `${key}-error` : hasHint ? `${key}-hint` : undefined);

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit, focusSummary)(e)} noValidate className="space-y-5">
      {submitCount > 0 && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="distributor-errors-title"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20"
        >
          <p id="distributor-errors-title" className="flex items-center gap-2 font-bold text-red-700">
            <AlertCircle aria-hidden="true" className="h-5 w-5" />
            {t('distributor.errors.summary_title')}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 ps-1 text-sm text-red-700">
            {errorList.map(({ key, message }) => (
              <li key={key}>
                <a href={`#${key}`} className="underline underline-offset-2 hover:no-underline">
                  {t(`distributor.form.${key}`)}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-500">{t('distributor.form.required_hint')}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t('distributor.form.name')} error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t('distributor.form.name_placeholder')}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('name')}
            className={fieldClass(errors.name)}
            {...register('name', {
              required: t('distributor.errors.name_required'),
              maxLength: { value: 100, message: t('distributor.errors.too_long') },
            })}
          />
        </Field>

        <Field id="phone" label={t('distributor.form.phone')} hint={t('distributor.form.phone_hint')} error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            placeholder="01xxxxxxxxx"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy('phone', true)}
            className={cn(fieldClass(errors.phone), 'rtl:text-right')}
            {...register('phone', {
              setValueAs: normalizePhone,
              required: t('distributor.errors.phone_required'),
              pattern: { value: /^01[0-9]{9}$/, message: t('distributor.errors.phone_invalid') },
            })}
          />
        </Field>
      </div>

      <Field id="governorate" label={t('distributor.form.governorate')} error={errors.governorate?.message}>
        <select
          id="governorate"
          aria-invalid={!!errors.governorate}
          aria-describedby={describedBy('governorate')}
          className={cn(fieldClass(errors.governorate), 'cursor-pointer')}
          {...register('governorate', { required: t('distributor.errors.governorate_required') })}
        >
          <option value="">{t('distributor.form.governorate_placeholder')}</option>
          {GOVERNORATES.map((g) => (
            <option key={g.en} value={g.en}>{ar ? g.ar : g.en}</option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="center" label={t('distributor.form.center')} error={errors.center?.message}>
          <input
            id="center"
            type="text"
            placeholder={t('distributor.form.center_placeholder')}
            aria-invalid={!!errors.center}
            aria-describedby={describedBy('center')}
            className={fieldClass(errors.center)}
            {...register('center', {
              required: t('distributor.errors.center_required'),
              maxLength: { value: 100, message: t('distributor.errors.too_long') },
            })}
          />
        </Field>
        <Field id="area" label={t('distributor.form.area')} error={errors.area?.message}>
          <input
            id="area"
            type="text"
            placeholder={t('distributor.form.area_placeholder')}
            aria-invalid={!!errors.area}
            aria-describedby={describedBy('area')}
            className={fieldClass(errors.area)}
            {...register('area', {
              required: t('distributor.errors.area_required'),
              maxLength: { value: 150, message: t('distributor.errors.too_long') },
            })}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <YesNo name="has_commercial_register" legend={t('distributor.form.has_commercial_register')} register={register} error={errors.has_commercial_register?.message} />
        <YesNo name="has_shop" legend={t('distributor.form.has_shop')} register={register} error={errors.has_shop?.message} />
      </div>

      <Field id="notes" label={t('distributor.form.notes')} optional error={errors.notes?.message}>
        <textarea
          id="notes"
          rows={4}
          maxLength={NOTES_MAX}
          placeholder={t('distributor.form.notes_placeholder')}
          aria-invalid={!!errors.notes}
          aria-describedby={describedBy('notes', true)}
          className={cn(fieldClass(errors.notes), 'h-auto resize-y py-3 leading-relaxed')}
          {...register('notes', { maxLength: { value: NOTES_MAX, message: t('distributor.errors.too_long') } })}
        />
        <p id="notes-hint" className="mt-1.5 text-end text-xs tabular-nums text-slate-400" aria-live="polite">
          {notesLength}/{NOTES_MAX}
        </p>
      </Field>

      {/* Honeypot: hidden from people, filled by bots; the API ignores requests that fill it */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" />
            {t('distributor.form.submitting')}
          </>
        ) : (
          <>
            <Send aria-hidden="true" className="h-5 w-5 rtl:-scale-x-100" />
            {t('distributor.form.submit')}
          </>
        )}
      </button>
    </form>
  );
}
