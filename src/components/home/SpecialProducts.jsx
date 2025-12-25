import React, { useCallback, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SmallProductCard from '../SmallProductCard';

export default function SpecialProducts({ title, products }) {
  const [api, setApi] = useState();

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollNext}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={scrollPrev}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div dir="ltr">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'end',
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <SmallProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
