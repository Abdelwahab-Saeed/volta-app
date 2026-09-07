import React from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../common/SafeImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

import { useTranslation } from 'react-i18next';
import { isRTL } from '@/i18n';

export default function CategoryCarousel({ categories, loading = false }) {

  const { t, i18n } = useTranslation();

  // While the request is in flight the carousel would otherwise render as an
  // empty row, then jump to full height when the data lands and shove
  // everything below it down the page. These placeholders occupy exactly the
  // same box as a real slide, so nothing moves.
  const items = loading
    ? Array.from({ length: 4 }).map((_, i) => ({ id: `skeleton-${i}`, skeleton: true }))
    : categories;
  return (
    <div dir='ltr' className="my-16">
      <h2 dir={isRTL(i18n.language) ? 'rtl' : 'ltr'} className="text-2xl font-bold mb-6">{t('home.features.categories')}</h2>
      <Carousel
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
          containScroll: 'trimSnaps',
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((category, index) => (
            <CarouselItem
              key={category.id ?? index}
              className="pl-2 md:pl-4 basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              {category.skeleton ? (
                // Mirrors the real slide exactly: same aspect-square box, same
                // gap-4, same text line height.
                <div className="flex flex-col items-center gap-4" aria-hidden="true">
                  <div className="w-full aspect-square animate-pulse rounded-2xl bg-slate-100" />
                  <span className="h-10 w-24 animate-pulse rounded bg-slate-100 md:h-14" />
                </div>
              ) : (
              <Link
                to={`/products?category=${category.id}`}
                className="group flex flex-col items-center gap-4 transition-all duration-300"
              >
                <div className="w-full aspect-square border-2 border-transparent overflow-hidden bg-slate-50 rounded-2xl shadow-sm group-hover:shadow-2xl group-hover:border-secondary/20 transition-all duration-500">
                  <SafeImage
                    // Some categories have no image; without this guard the src
                    // becomes ".../storage/null" and costs a 404 round-trip
                    // before the fallback kicks in.
                    src={category.image ? `${import.meta.env.VITE_IMAGES_URL}/${category.image}` : undefined}
                    alt={category.name}
                    // Embla renders all slides in the DOM, so without this every
                    // category image downloads on page load - only ~4 are visible.
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                </div>
                {/* Fixed two-line box (h-10 = 2x the text-sm line height,
                    h-14 = 2x text-xl). Category names vary in length and wrap
                    unpredictably in Arabic, so without a fixed height the row
                    height depends on the data and shifts when it arrives. */}
                <span className="line-clamp-2 h-10 md:h-14 text-sm md:text-xl font-bold text-center text-slate-800 group-hover:text-secondary transition-colors duration-300">
                  {category.name}
                </span>
              </Link>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
}
