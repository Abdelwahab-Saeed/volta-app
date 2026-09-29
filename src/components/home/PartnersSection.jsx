import { useTranslation } from 'react-i18next';
import SafeImage from '../common/SafeImage';
import SectionHeading from './SectionHeading';
import useApiList from '@/hooks/useApiList';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { getPartners } from '@/api/company.api';
import { useLocalize } from '@/lib/localize';
import { cn } from '@/lib/utils';

// Below this many logos a row sits still in the middle instead of scrolling: a short list
// repeated in a marquee looks like padding.
const MARQUEE_MIN = 5;

function Logo({ partner, hidden = false }) {
  const tr = useLocalize();
  const name = tr(partner, 'name');

  const box = (
    <div className="flex h-20 w-36 md:h-24 md:w-44 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 group-hover/logo:-translate-y-0.5 group-hover/logo:border-secondary/30 group-hover/logo:shadow-[0_12px_30px_-18px_rgba(30,39,73,0.5)]">
      <SafeImage
        src={`${import.meta.env.VITE_IMAGES_URL}/${partner.logo}`}
        alt={hidden ? '' : name}
        title={name}
        className="max-h-full max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
      />
    </div>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hidden ? -1 : undefined}
        className="group/logo block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        {box}
      </a>
    );
  }

  return <div className="group/logo">{box}</div>;
}

// Each half of a moving track holds at least this many logos, so it is always wider than the screen.
const MARQUEE_HALF = 12;

function LogoRow({ label, partners, reverse = false }) {
  const reducedMotion = usePrefersReducedMotion();
  const moving = !reducedMotion && partners.length >= MARQUEE_MIN;

  return (
    <div>
      <p className="mb-4 text-center text-xs md:text-sm font-bold text-muted-foreground">{label}</p>
      {moving ? (
        <MarqueeTrack partners={partners} reverse={reverse} />
      ) : (
        <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
          {partners.map((partner) => (
            <li key={partner.id}><Logo partner={partner} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MarqueeTrack({ partners, reverse }) {
  // The track is two identical halves and slides by exactly one half (translateX(-50%)), which loops
  // without a seam. Spacing is padding on each item rather than `gap`, so both halves are equally wide.
  // Logos have no reading direction, so the track is always LTR.
  const repeat = Math.ceil(MARQUEE_HALF / partners.length);
  const half = Array.from({ length: repeat }, () => partners).flat();
  const track = [...half, ...half];

  return (
    <div dir="ltr" className="marquee-mask overflow-hidden py-2">
      <ul
        className={cn('marquee-track flex w-max', reverse && 'marquee-reverse')}
        // Same speed whatever the number of logos
        style={{ animationDuration: `${half.length * 3.5}s` }}
      >
        {track.map((partner, index) => {
          // Only the first copy of each logo is announced and focusable.
          const copy = index >= partners.length;
          return (
            <li key={index} className="pr-4 md:pr-6" aria-hidden={copy || undefined}>
              <Logo partner={partner} hidden={copy} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PartnersSection() {
  const { t } = useTranslation();
  const { items } = useApiList(getPartners);

  const partners = items.filter((item) => item.type !== 'client');
  const clients = items.filter((item) => item.type === 'client');

  // Far below the fold, so while loading (or when the admin has added nothing) the section simply
  // isn't there; the request finishes long before anyone scrolls this far.
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="home-partners" className="py-10 md:py-14">
      <SectionHeading
        id="home-partners"
        align="center"
        eyebrow={t('home.partners.eyebrow')}
        title={t('home.partners.title')}
        subtitle={t('home.partners.subtitle')}
      />

      <div className="space-y-8 md:space-y-10">
        {partners.length > 0 && <LogoRow label={t('home.partners.partners_label')} partners={partners} />}
        {clients.length > 0 && <LogoRow label={t('home.partners.clients_label')} partners={clients} reverse />}
      </div>
    </section>
  );
}
