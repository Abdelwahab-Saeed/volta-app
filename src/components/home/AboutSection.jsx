import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import stabilizer from '@/assets/home/stabilizer.webp';

const POINTS = ['home.about.point_volta', 'home.about.point_voltafay', 'home.about.point_support'];

/** Short "who we are" block linking to the full About page. Facts only come from about_us.* texts. */
export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="home-about" className="py-10 md:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            id="home-about"
            className="mb-5 md:mb-6"
            eyebrow={t('about_us.title')}
            title={t('home.about.title')}
          />
          <p className="text-base md:text-lg leading-loose text-slate-600">{t('home.about.text')}</p>

          <ul className="mt-6 space-y-3">
            {POINTS.map((key) => (
              <li key={key} className="flex items-start gap-3">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <span className="font-medium text-slate-700">{t(key)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/about-us"
              className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('home.about.more')}
              <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/products"
              className="inline-flex min-h-12 items-center rounded-xl border-2 border-primary/15 px-6 font-bold text-primary transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              {t('home.about.shop')}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 pt-10 pb-8 md:px-12 md:pt-14">
            <div aria-hidden="true" className="absolute -top-1/4 -end-1/4 h-3/4 w-3/4 rounded-full bg-secondary-on-dark/30 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-1/3 -start-1/4 h-2/3 w-2/3 rounded-full bg-secondary/25 blur-3xl" />
            {/* Faint grid, a nod to electrical panels */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl bg-white p-4 shadow-2xl">
              <img
                src={stabilizer}
                alt={t('home.about.image_alt')}
                width="720"
                height="720"
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="absolute -bottom-5 start-6 md:start-10 rounded-2xl bg-white px-5 py-3 shadow-xl ring-1 ring-slate-100">
            <p className="text-xs font-bold text-muted-foreground">{t('home.about.since')}</p>
            <p className="mt-1 text-2xl font-black text-primary leading-none">2011</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
