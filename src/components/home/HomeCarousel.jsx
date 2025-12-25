import React, { useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function HomeCarousel({ banners }) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <div dir="ltr" className="my-4">
      <Carousel
        className="w-full"
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-100">
          {banners.map((banner, index) => (
            <CarouselItem key={index}>
              <div className="p-1 h-full">
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
