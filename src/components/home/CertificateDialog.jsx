import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { useLocalize } from '@/lib/localize';

/** Full-size view of one certificate. Lazy-loaded by CertificatesSection on the first click. */
export default function CertificateDialog({ certificate, open, onOpenChange }) {
  const { t } = useTranslation();
  const tr = useLocalize();
  const title = tr(certificate, 'title');
  const issuer = tr(certificate, 'issuer');
  const description = tr(certificate, 'description');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-3xl bg-white"
      >
        <div className="relative bg-slate-100 p-4 md:p-6">
          <img
            src={`${import.meta.env.VITE_IMAGES_URL}/${certificate.image}`}
            alt={title}
            className="mx-auto max-h-[65vh] w-auto object-contain"
          />
          <DialogClose
            aria-label={t('home.certificates.close')}
            className="absolute top-3 end-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-md transition-colors hover:bg-primary hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </DialogClose>
        </div>
        <div className="p-5 md:p-6 text-start">
          <DialogTitle className="text-lg md:text-xl font-black text-primary">{title}</DialogTitle>
          {(issuer || certificate.issued_year) && (
            <p className="mt-1 text-sm font-medium text-secondary">
              {[issuer, certificate.issued_year].filter(Boolean).join(' · ')}
            </p>
          )}
          {description && (
            <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
