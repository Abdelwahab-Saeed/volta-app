import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Maximize2, Shield, Star } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import useApiList from '@/hooks/useApiList';
import { getCertificates } from '@/api/company.api';
import { useLocalize } from '@/lib/localize';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const CertificateDialog = lazy(() => import('./CertificateDialog'));

const imageSrc = (path) => `${import.meta.env.VITE_IMAGES_URL}/${path}`;

/* ─── single card ──────────────────────────────────────────────── */
function CertificateCard({ certificate, onOpen }) {
  const { t } = useTranslation();
  const tr = useLocalize();
  const title = tr(certificate, 'title');
  const issuer = tr(certificate, 'issuer');

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t('home.certificates.open', { title })}
      className="cert-card group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-start cursor-pointer select-none shadow-sm"
      style={{ width: 220, minWidth: 220, flexShrink: 0 }}
    >
      {/* glow ring on hover */}
      <span className="cert-glow pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

      {/* image area */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-t-2xl bg-slate-50 p-5" style={{ height: 160 }}>
        <SafeImage
          src={imageSrc(certificate.image)}
          alt=""
          className="max-h-full w-auto object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-[1.08]"
        />
        {/* expand icon */}
        <span aria-hidden="true" className="absolute top-2.5 end-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" />
        </span>
        {/* year badge */}
        {certificate.issued_year && (
          <span className="absolute bottom-2.5 start-2.5 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
            {certificate.issued_year}
          </span>
        )}
      </div>

      {/* text area */}
      <div className="flex flex-1 items-start gap-2.5 px-4 py-3.5">
        <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Award className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-primary leading-snug line-clamp-2">{title}</h3>
          {issuer && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{issuer}</p>}
        </div>
      </div>
    </button>
  );
}

/* ─── marquee row ──────────────────────────────────────────────── */
function MarqueeRow({ items, onOpen, reverse = false, speed = 12 }) {
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // translateX(-50%) moves exactly 2 sets, landing back at the identical view → seamless.
  const repeated = [...items, ...items, ...items, ...items];

  return (
    // Always LTR: the -50% loop assumes the track grows to the right, in Arabic it would slide into empty space.
    <div
      dir="ltr"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-4"
        style={{
          animation: reducedMotion
            ? 'none'
            : `cert-scroll-${reverse ? 'reverse' : 'forward'} ${items.length * speed}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {repeated.map((cert, i) => (
          <CertificateCard
            key={`${cert.id}-${i}`}
            certificate={cert}
            onOpen={() => onOpen(cert)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── section ──────────────────────────────────────────────────── */
export default function CertificatesSection() {
  const { t } = useTranslation();
  const { items } = useApiList(getCertificates);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  const handleOpen = (cert) => { setSelected(cert); setIsOpen(true); };

  // Split into two rows (alternating) when enough items, else one row
  const row1 = items.length >= 4 ? items.filter((_, i) => i % 2 === 0) : items;
  const row2 = items.length >= 4 ? items.filter((_, i) => i % 2 !== 0) : null;

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes cert-scroll-forward {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cert-scroll-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .cert-card {
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .cert-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 24px 60px -12px rgba(30, 39, 73, 0.18);
          border-color: rgba(35, 48, 116, 0.3);
        }
        .cert-glow {
          background: radial-gradient(ellipse at 50% 0%, rgba(35,48,116,0.06) 0%, transparent 70%);
        }
      `}</style>

      <section
        aria-labelledby="home-certificates"
        className="relative overflow-hidden bg-white py-16 md:py-24"
      >

        {/* Centered heading */}
        <div className="mb-10 md:mb-14 px-6 text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest uppercase" style={{ color: '#233074' }}>
            <Shield className="h-4 w-4" />
            {t('home.certificates.eyebrow')}
            <Shield className="h-4 w-4" />
          </p>
          <h2
            id="home-certificates"
            className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-primary"
          >
            {t('home.certificates.title')}
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
            {t('home.certificates.subtitle')}
          </p>

          {/* decorative stars */}
          <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-80" />
            ))}
          </div>
        </div>

        {/* Marquee tracks — full-bleed (no container padding) */}
        <div className="flex flex-col gap-4">
          <MarqueeRow items={row1} onOpen={handleOpen} reverse={false} speed={12} />
          {row2 && row2.length > 0 && (
            <MarqueeRow items={row2} onOpen={handleOpen} reverse={true} speed={15} />
          )}
        </div>

        {/* Edge fade masks */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-0 w-24 md:w-40 z-10" style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 end-0 w-24 md:w-40 z-10" style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }} />
      </section>

      {selected && (
        <Suspense fallback={null}>
          <CertificateDialog certificate={selected} open={isOpen} onOpenChange={setIsOpen} />
        </Suspense>
      )}
    </>
  );
}
