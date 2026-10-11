import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BadgePercent, Clock, Headset, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const BENEFITS = [
  { key: 'pricing', Icon: BadgePercent },
  { key: 'support', Icon: Headset },
  { key: 'products', Icon: ShieldCheck },
];
const STEPS = ['send', 'call', 'sell'];

/** "Become a Volta distributor" band: benefits and the three steps, linking to the form page. */
export default function DistributorCta() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="home-distributor" className="py-10 md:py-14">
      <Reveal className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-linear-to-br from-secondary/10 via-white to-white p-6 md:p-10 lg:p-12">
        <div aria-hidden="true" className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeading
              id="home-distributor"
              className="mb-6"
              eyebrow={t('distributor.home.eyebrow')}
              title={t('distributor.home.title')}
              subtitle={t('distributor.home.text')}
            />

            <ul className="flex flex-wrap gap-2.5">
              {BENEFITS.map((benefit) => (
                <li key={benefit.key} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">
                  <benefit.Icon aria-hidden="true" className="h-4 w-4 text-secondary" />
                  {t(`distributor.benefits.${benefit.key}.title`)}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                to="/become-distributor"
                className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t('distributor.home.cta')}
                <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
              </Link>
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                <Clock aria-hidden="true" className="h-4 w-4" />
                {t('distributor.home.cta_hint')}
              </span>
            </div>
          </div>

          <ol className="space-y-3 lg:col-span-2">
            {STEPS.map((key, index) => (
              <li key={key} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-black text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-primary">
                    <span className="sr-only">{index + 1}. </span>
                    {t(`distributor.steps.${key}.title`)}
                  </p>
                  <p className="text-sm text-slate-500">{t(`distributor.steps.${key}.text`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
