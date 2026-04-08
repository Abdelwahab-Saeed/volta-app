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

export default function CategoryCarousel({ categories }) {

  const { t, i18n } = useTranslation();
  return (
    <div dir='ltr' className="my-16">
      <h2 dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="text-2xl font-bold mb-6">{t('home.features.categories')}</h2>
      <Carousel
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
          containScroll: 'trimSnaps',
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Link
                to={`/products?category=${category.id}`}
                className="group flex flex-col items-center gap-4 transition-all duration-300"
              >
                <div className="w-full aspect-square border-2 border-transparent overflow-hidden bg-slate-50 rounded-2xl shadow-sm group-hover:shadow-2xl group-hover:border-secondary/20 transition-all duration-500">
                  <SafeImage
                    src={`${import.meta.env.VITE_IMAGES_URL}/${category.image}`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <span className="text-sm md:text-xl font-bold text-center text-slate-800 group-hover:text-secondary transition-colors duration-300">
                  {category.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
}
