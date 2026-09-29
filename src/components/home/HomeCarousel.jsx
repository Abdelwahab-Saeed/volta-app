import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import SafeImage from '../common/SafeImage';
import { useLocalize } from '@/lib/localize';
import { cn } from '@/lib/utils';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

// One place for the banner box size: the skeleton, the slides and the images all use it, so the page
// does not jump when the banners arrive. Heights (not an aspect ratio) keep the crop admins already
// designed their banners for.
const BANNER_HEIGHT = 'h-[200px] md:h-[400px]';

export default function HomeCarousel({ banners, loading }) {
  const { t } = useTranslation();
  const tr = useLocalize();
  const reducedMotion = usePrefersReducedMotion();

  // Pauses while the pointer is over the banner so nobody loses a slide they are reading.
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const plugins = useMemo(() => (reducedMotion ? [] : [autoplay.current]), [reducedMotion]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, plugins);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (loading) {
    return (
      <div className={cn('mt-4 md:mt-6 w-full', BANNER_HEIGHT)}>
        <Skeleton className="h-full w-full rounded-2xl md:rounded-3xl" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const multiple = banners.length > 1;

  return (
    <section
      dir="ltr"
      aria-roledescription="carousel"
      aria-label={t('home.hero.label')}
      className="group relative mt-4 md:mt-6 overflow-hidden rounded-2xl md:rounded-3xl bg-slate-100 shadow-[0_20px_50px_-25px_rgba(30,39,73,0.45)]"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className={cn('flex', BANNER_HEIGHT)}>
          {banners.map((banner, index) => {
            const imageUrl = typeof banner === 'string' ? banner : banner.image;
            return (
              <div
                key={banner.id ?? index}
                className="min-w-0 shrink-0 grow-0 basis-full"
                role="group"
                aria-roledescription="slide"
                aria-label={t('home.hero.slide', { current: index + 1, total: banners.length })}
              >
                <SafeImage
                  src={imageUrl ? `${import.meta.env.VITE_IMAGES_URL}/${imageUrl}` : undefined}
                  alt={tr(banner, 'title') || `Banner ${index + 1}`}
                  // The first banner is the LCP element: load it eagerly and at
                  // high priority. Embla keeps every slide in the DOM, so the
                  // rest must be lazy or they compete for bandwidth with it.
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding={index === 0 ? 'sync' : 'async'}
                  className={cn('w-full object-cover', BANNER_HEIGHT)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {multiple && (
        <>
          {/* Soft shade at the bottom so the dots stay visible on light banners */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 md:h-28 bg-gradient-to-t from-black/35 to-transparent" />

          <button
            type="button"
            onClick={scrollPrev}
            aria-label={t('a11y.previous')}
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition-all hover:bg-white md:flex md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label={t('a11y.next')}
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition-all hover:bg-white md:flex md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Raised on md+ because the features strip overlaps the bottom of the banner there */}
          <div className="absolute inset-x-0 bottom-2 md:bottom-11 flex justify-center">
            {banners.map((banner, index) => (
              <button
                key={banner.id ?? index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={t('home.hero.go_to', { number: index + 1 })}
                aria-current={index === selected ? 'true' : undefined}
                className="group/dot flex h-6 items-center px-1 cursor-pointer"
              >
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-all duration-300',
                    index === selected ? 'w-7 bg-white' : 'w-1.5 bg-white/60 group-hover/dot:bg-white/90',
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
