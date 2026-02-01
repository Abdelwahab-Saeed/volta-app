import React, { useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Skeleton } from '../ui/skeleton';
import SafeImage from '../common/SafeImage';

export default function HomeCarousel({ banners, loading }) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  if (loading) {
    return (
      <div className="my-4 h-[200px] md:h-[400px] w-full">
        <Skeleton className="h-full w-full rounded-md" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

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
          {banners.map((banner, index) => {
            const imageUrl = typeof banner === 'string' ? banner : banner.image;
            return (
              <CarouselItem key={index}>
                <div className="p-1 h-full">
                  <SafeImage
                    src={`${import.meta.env.VITE_IMAGES_URL}/${imageUrl}`}
                    alt={banner.title || `Banner ${index + 1}`}
                    className="h-[200px] md:h-[400px] w-full object-cover rounded-md"
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
