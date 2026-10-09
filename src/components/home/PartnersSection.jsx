import { useTranslation } from 'react-i18next';
import SafeImage from '../common/SafeImage';
import useApiList from '@/hooks/useApiList';
import { getPartners } from '@/api/company.api';
import { useLocalize } from '@/lib/localize';
import { Handshake } from 'lucide-react';

// One half of the marquee holds at least this many tiles, so the row is wider than the screen
// and the loop has no gap even when the admin has added only a few logos.
const MIN_TILES = 10;
// Seconds each tile takes to cross, so the speed stays the same whatever the number of logos.
const SECONDS_PER_TILE = 3;

/* ─── single logo tile ─────────────────────────────────────────── */
function LogoTile({ partner, hidden = false }) {
  const tr = useLocalize();
  const name = tr(partner, 'name');

  const inner = (
    <div className="partners-tile group relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
      style={{ width: 160, minWidth: 160, height: 110 }}
    >
      <div className="flex w-full items-center justify-center">
        <SafeImage
          src={`${import.meta.env.VITE_IMAGES_URL}/${partner.logo}`}
          alt={name}
          title={name}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-[80%] object-contain transition-all duration-400 group-hover:opacity-100 group-hover:scale-105"
        />
      </div>
      <p className="w-full text-center text-[11px] font-semibold text-slate-400 transition-colors duration-300 group-hover:text-primary line-clamp-1">
        {name}
      </p>
    </div>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer"
        tabIndex={hidden ? -1 : undefined}
        className="block shrink-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {inner}
      </a>
    );
  }
  return <div className="shrink-0">{inner}</div>;
}

/* ─── endless logo row ─────────────────────────────────────────── */
// Uses the shared .marquee-* rules in index.css: the track holds the same half twice and slides by
// half its width, pauses on hover/focus and stands still for prefers-reduced-motion.
function LogoMarquee({ partners }) {
  const copies = Math.max(1, Math.ceil(MIN_TILES / partners.length));
  const half = Array.from({ length: copies }, () => partners).flat();

  return (
    // Always LTR: logos have no reading direction, and the -50% loop would slide into empty space in RTL.
    <div dir="ltr" className="marquee-mask overflow-hidden py-3">
      <div
        className="marquee-track flex w-max"
        style={{ animationDuration: `${half.length * SECONDS_PER_TILE}s` }}
      >
        {[0, 1].map((copy) => (
          // The second half only exists for the loop; screen readers and Tab skip it.
          <ul key={copy} className="flex shrink-0 gap-4 pe-4" aria-hidden={copy === 1 ? 'true' : undefined}>
            {half.map((partner, index) => (
              <li key={`${partner.id}-${index}`}>
                <LogoTile partner={partner} hidden={copy === 1} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ─── section ──────────────────────────────────────────────────── */
// Partners and clients are shown together as one "success partners" row.
export default function PartnersSection() {
  const { t } = useTranslation();
  const { items } = useApiList(getPartners);

  if (items.length === 0) return null;

  return (
    <>
      <style>{`
        .partners-tile {
          transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .partners-tile:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -12px rgba(35,48,116,0.18);
          border-color: rgba(35,48,116,0.25);
        }
      `}</style>

      <section
        aria-labelledby="home-partners"
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#f1f5f9 60%,#f8fafc 100%)' }}
      >
        {/* top stripe */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1"
          style={{ background: 'linear-gradient(to right,transparent,#233074 30%,#233074 70%,transparent)' }} />

        {/* ── Heading ── */}
        <div className="mb-10 md:mb-12 px-6 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
            style={{ background: 'linear-gradient(135deg,#233074,#3b5bdb)' }}>
            <Handshake className="h-7 w-7 text-white" />
          </div>
          <p className="mb-2 text-xs md:text-sm font-bold tracking-widest uppercase" style={{ color: '#233074' }}>
            {t('home.partners.eyebrow')}
          </p>
          <h2 id="home-partners" className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-primary">
            {t('home.partners.title')}
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
            {t('home.partners.subtitle')}
          </p>
        </div>

        <LogoMarquee partners={items} />

        {/* bottom stripe */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-1"
          style={{ background: 'linear-gradient(to right,transparent,#233074 30%,#233074 70%,transparent)' }} />
      </section>
    </>
  );
}
