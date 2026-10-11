import { useTranslation } from 'react-i18next';
import { Users, ThumbsUp, PackageCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import useInView from '@/hooks/useInView';
import useCountUp from '@/hooks/useCountUp';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const STATS = [
  { key: 'clients', value: 3000, prefix: '+', Icon: Users },
  { key: 'satisfaction', value: 99, suffix: '%', Icon: ThumbsUp },
  { key: 'orders', value: 5000, prefix: '+', Icon: PackageCheck },
];

const format = (n) => n.toLocaleString('en-US');

function StatCard({ stat, index, start, reducedMotion }) {
  const { t } = useTranslation();
  const current = useCountUp(stat.value, { start, animate: !reducedMotion, delay: index * 150 });
  const Icon = stat.Icon;
  const finalText = `${stat.prefix ?? ''}${format(stat.value)}${stat.suffix ?? ''}`;
  const label = t(`home.stats.${stat.key}.label`);

  return (
    <Reveal
      as="li"
      delay={index * 120}
      className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 pt-8 pb-9 text-center shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-colors duration-300 group-hover:bg-secondary group-hover:text-white">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>

      {/* Screen readers get the final figure once; the counting digits are visual only */}
      <span className="sr-only">{`${finalText} ${label}`}</span>
      <span aria-hidden="true" dir="ltr" className="relative inline-block text-4xl md:text-5xl font-black tabular-nums leading-none text-primary">
        {/* The invisible final value reserves the width so the card doesn't jitter while counting */}
        <span className="invisible">{finalText}</span>
        <span className="absolute inset-0">
          {stat.prefix && <span className="text-secondary">{stat.prefix}</span>}
          {format(current)}
          {stat.suffix && <span className="text-secondary">{stat.suffix}</span>}
        </span>
      </span>

      <p aria-hidden="true" className="mt-3 text-base md:text-lg font-bold text-primary">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(`home.stats.${stat.key}.description`)}</p>

      {/* Bottom bar fills along with the count (to 99% for satisfaction) */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-slate-100">
        <span
          className="block h-full ltr:origin-left rtl:origin-right ltr:bg-linear-to-r rtl:bg-linear-to-l from-primary to-secondary"
          style={{ transform: `scaleX(${current / (stat.suffix === '%' ? 100 : stat.value)})` }}
        />
      </span>
    </Reveal>
  );
}

/** "Volta in numbers": customers, satisfaction and orders, counting up when scrolled into view. */
export default function StatsSection() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const [ref, inView] = useInView({ rootMargin: '0px 0px -15% 0px' });

  return (
    <section ref={ref} aria-labelledby="home-stats" className="py-14 md:py-20">
      <SectionHeading
        id="home-stats"
        align="center"
        eyebrow={t('home.stats.eyebrow')}
        title={t('home.stats.title')}
        subtitle={t('home.stats.subtitle')}
      />

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-6">
        {STATS.map((stat, index) => (
          <StatCard key={stat.key} stat={stat} index={index} start={inView} reducedMotion={reducedMotion} />
        ))}
      </ul>
    </section>
  );
}
