import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Maximize2 } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import useApiList from '@/hooks/useApiList';
import { getCertificates } from '@/api/company.api';
import { useLocalize } from '@/lib/localize';

const CertificateDialog = lazy(() => import('./CertificateDialog'));

const imageSrc = (path) => `${import.meta.env.VITE_IMAGES_URL}/${path}`;

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
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-[0_20px_45px_-24px_rgba(30,39,73,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 p-4">
        <SafeImage
          src={imageSrc(certificate.image)}
          alt=""
          className="h-full w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span aria-hidden="true" className="absolute top-3 end-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>
        {certificate.issued_year && (
          <span className="absolute bottom-3 start-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">
            {certificate.issued_year}
          </span>
        )}
      </div>
      <div className="flex flex-1 items-start gap-3 p-4 md:p-5">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
          <Award className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-primary leading-snug line-clamp-2">{title}</h3>
          {issuer && <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{issuer}</p>}
        </div>
      </div>
    </button>
  );
}

export default function CertificatesSection() {
  const { t } = useTranslation();
  const { items } = useApiList(getCertificates);
  // `selected` outlives `isOpen` so the dialog keeps its content while it animates closed.
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="home-certificates" className="py-10 md:py-14">
      <SectionHeading
        id="home-certificates"
        eyebrow={t('home.certificates.eyebrow')}
        title={t('home.certificates.title')}
        subtitle={t('home.certificates.subtitle')}
      />

      {/* Centred rows so a few certificates don't hug one side */}
      <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
        {items.map((certificate, index) => (
          <Reveal
            as="li"
            key={certificate.id}
            delay={Math.min(index, 3) * 80}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]"
          >
            <CertificateCard certificate={certificate} onOpen={() => { setSelected(certificate); setIsOpen(true); }} />
          </Reveal>
        ))}
      </ul>

      {/* The dialog code is only downloaded the first time someone opens a certificate */}
      {selected && (
        <Suspense fallback={null}>
          <CertificateDialog certificate={selected} open={isOpen} onOpenChange={setIsOpen} />
        </Suspense>
      )}
    </section>
  );
}
