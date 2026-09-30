import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import SectionHeading from './SectionHeading';
import { isRTL } from '@/i18n';
import { useLocalize } from '@/lib/localize';

function NavButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:border-secondary hover:bg-secondary hover:text-white disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
    >
      {children}
    </button>
  );
}

export default function CategoryCarousel({ categories, loading = false }) {
  const { t, i18n } = useTranslation();
  const tr = useLocalize();
  const rtl = isRTL(i18n.language);

  // Embla scrolls in the page direction, so "previous" is always the start side.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    direction: rtl ? 'rtl' : 'ltr',
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    return () => {
      emblaApi.off('select', update);
      emblaApi.off('reInit', update);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!loading && (!categories || categories.length === 0)) return null;

  // While the request is in flight the carousel would otherwise render as an
  // empty row, then jump to full height when the data lands and shove
  // everything below it down the page. These placeholders occupy exactly the
  // same box as a real slide, so nothing moves.
  const items = loading
    ? Array.from({ length: 5 }).map((_, i) => ({ id: `skeleton-${i}`, skeleton: true }))
    : categories;

  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <section aria-labelledby="home-categories" className="py-10 md:py-14">
      <SectionHeading
        id="home-categories"
        eyebrow={t('home.categories.eyebrow')}
        title={t('home.features.categories')}
        subtitle={t('home.categories.subtitle')}
        action={{ to: '/products', label: t('home.categories.view_all') }}
      >
        <div className="hidden sm:flex items-center gap-2">
          <NavButton onClick={scrollPrev} disabled={!canPrev} label={t('a11y.previous')}><PrevIcon className="h-5 w-5" /></NavButton>
          <NavButton onClick={scrollNext} disabled={!canNext} label={t('a11y.next')}><NextIcon className="h-5 w-5" /></NavButton>
        </div>
      </SectionHeading>

      <div ref={emblaRef} dir={rtl ? 'rtl' : 'ltr'} className="overflow-hidden -m-2 p-2">
        <ul className="flex -ms-3 md:-ms-5">
          {items.map((category, index) => (
            <li
              key={category.id ?? index}
              className="min-w-0 shrink-0 grow-0 ps-3 md:ps-5 basis-[42%] sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              {category.skeleton ? (
                // Mirrors the real slide exactly: same aspect-square box, same
                // text line height.
                <div aria-hidden="true">
                  <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-100" />
                  <div className="mt-3 h-10 md:h-12 w-2/3 mx-auto animate-pulse rounded bg-slate-100" />
                </div>
              ) : (
                <Link
                  to={`/products?category=${category.id}`}
                  className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-slate-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-secondary/30 group-hover:shadow-[0_18px_40px_-20px_rgba(30,39,73,0.45)]">
                    <SafeImage
                      // Some categories have no image; without this guard the src
                      // becomes ".../storage/null" and costs a 404 round-trip
                      // before the fallback kicks in.
                      src={category.image ? `${import.meta.env.VITE_IMAGES_URL}/${category.image}` : undefined}
                      alt=""
                      // Embla renders all slides in the DOM, so without this every
                      // category image downloads on page load - only ~5 are visible.
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  {/* Fixed two-line box. Category names vary in length and wrap
                      unpredictably in Arabic, so without a fixed height the row
                      height depends on the data and shifts when it arrives. */}
                  <span className="mt-3 block h-10 md:h-12 text-center text-sm md:text-base font-bold leading-5 md:leading-6 text-slate-800 line-clamp-2 transition-colors group-hover:text-secondary">
                    {tr(category, 'name')}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
