import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Square, BadgePercent, Headset, ShieldCheck, Send, PhoneCall, Store } from 'lucide-react';
import DistributorForm from '@/components/distributor/DistributorForm';
import useSeo from '@/hooks/useSeo';

const BENEFITS = [
  { key: 'pricing', Icon: BadgePercent },
  { key: 'support', Icon: Headset },
  { key: 'products', Icon: ShieldCheck },
];

const STEPS = [
  { key: 'send', Icon: Send },
  { key: 'call', Icon: PhoneCall },
  { key: 'sell', Icon: Store },
];

/** "Become a Volta distributor": why join, how it works, and the form. */
export default function BecomeDistributor() {
  const { t } = useTranslation();

  useSeo({
    title: t('distributor.page_title'),
    description: t('distributor.seo_description'),
  });

  return (
    <>
      <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('distributor.page_title')}</h1>
        <p className="mb-4 max-w-2xl text-slate-600 leading-relaxed">{t('distributor.page_subtitle')}</p>
        <div className="flex gap-2 items-center text-primary text-sm md:text-base">
          <Link to="/" className="hover:underline">{t('header.home')}</Link>
          <Square fill="true" size={8} aria-hidden="true" />
          <span>{t('distributor.page_title')}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-10 md:py-14 lg:grid-cols-5 lg:gap-12">
        {/* Form first on phones; on desktop it sits on the end side */}
        <section aria-labelledby="distributor-form-title" className="lg:order-2 lg:col-span-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 id="distributor-form-title" className="text-2xl font-black text-primary">{t('distributor.form_title')}</h2>
            <p className="mt-1 mb-6 text-slate-600">{t('distributor.form_subtitle')}</p>
            <DistributorForm />
          </div>
        </section>

        <aside className="space-y-8 lg:order-1 lg:col-span-2">
          <section aria-labelledby="distributor-why">
            <h2 id="distributor-why" className="mb-4 text-xl font-black text-primary">{t('distributor.why_title')}</h2>
            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit.key} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                    <benefit.Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-bold text-primary">{t(`distributor.benefits.${benefit.key}.title`)}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{t(`distributor.benefits.${benefit.key}.text`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="distributor-steps" className="rounded-3xl bg-primary p-6 text-white">
            <h2 id="distributor-steps" className="mb-5 text-xl font-black">{t('distributor.steps_title')}</h2>
            <ol className="space-y-5">
              {STEPS.map((step, index) => (
                <li key={step.key} className="relative flex gap-4">
                  {/* Line linking the step badges */}
                  {index < STEPS.length - 1 && (
                    <span aria-hidden="true" className="absolute top-11 bottom-[-1.25rem] start-5 w-px bg-white/20" />
                  )}
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-secondary-on-dark ring-1 ring-white/20">
                    <step.Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">
                      <span className="sr-only">{index + 1}. </span>
                      {t(`distributor.steps.${step.key}.title`)}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/75">{t(`distributor.steps.${step.key}.text`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </>
  );
}
