import { BadgeCheck, BadgePercent, Headset, ShieldCheck, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const FEATURES = [
  { icon: Truck, title: 'home.features.shipping_title', desc: 'home.features.shipping_desc' },
  { icon: BadgeCheck, title: 'home.features.offers_title', desc: 'home.features.offers_desc' },
  { icon: ShieldCheck, title: 'home.features.returns_title', desc: 'home.features.returns_desc' },
  { icon: BadgePercent, title: 'home.features.members_title', desc: 'home.features.members_desc' },
  { icon: Headset, title: 'home.features.support_title', desc: 'home.features.support_desc' },
];

/**
 * The store's promises, as one strip right under the banner. `overlap` lifts it over the bottom edge of
 * the banner on larger screens (only when a banner is actually shown above it).
 */
export default function FeaturesSection({ overlap = false }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.features.label')} className={cn('relative z-10 mt-4', overlap && 'md:-mt-8 md:mx-6 lg:mx-10')}>
      <ul className="grid grid-cols-2 lg:grid-cols-5 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 shadow-[0_12px_40px_-20px_rgba(30,39,73,0.35)]">
        {FEATURES.map(({ icon, title, desc }, index) => {
          const Icon = icon;
          return (
            // Icon above the text on phones (two narrow columns), beside it from sm up. Five items in two
            // columns leave one over, so the first takes a whole row until all five fit in one.
            <li
              key={title}
              className={cn(
                'flex flex-col items-start gap-2 bg-white p-4 sm:flex-row sm:items-center sm:gap-3 md:p-5',
                index === 0 && 'col-span-2 flex-row items-center gap-3 lg:col-span-1',
              )}
            >
              <span className="flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Icon aria-hidden="true" className="h-5 w-5 md:h-6 md:w-6" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm md:text-base font-bold text-primary leading-snug">{t(title)}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-snug">{t(desc)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
