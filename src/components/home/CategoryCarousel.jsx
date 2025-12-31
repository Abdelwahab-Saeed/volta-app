import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export default function CategoryCarousel({ categories }) {
  return (
    <div dir="ltr" className="my-8">
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
              className="pl-2 md:pl-4  basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border overflow-hidden bg-gray-200">
                  <img
                    src={`${import.meta.env.VITE_IMAGES_URL}/${category.image}`}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm md:text-base font-medium text-center">
                  {category.name}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
}
