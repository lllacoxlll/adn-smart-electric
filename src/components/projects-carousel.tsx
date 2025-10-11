'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

interface ImageData {
  src: string,
  alt: string,
}

const images: ImageData[] = [
  { src: '/solar-panel.jpeg', alt: 'solar panel' },
  { src: '/motion-sensor.jpeg', alt: 'motion sensor' },
  { src: '/circuit-breaker.jpeg', alt: 'circuit breaker' },
  { src: '/battery.jpeg', alt: 'indoor battery' },
  { src: '/hvac.jpeg', alt: 'hvac unit' },
  { src: '/electrical-panel.jpeg', alt: 'electrical panel' }
]

export function ProjectsCarousel() {
  type Orientation = 'horizontal' | 'vertical'
  const [orientation, setOrientation] = useState<Orientation>('horizontal')

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 436) {
        setOrientation('vertical')
      } else {
        setOrientation('horizontal')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Carousel
      orientation={orientation}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full max-w-xs md:max-w-6xl"
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/3 lg:basis-1/3"
          >
            <div className="p-1">
              <Card>
                <CardContent className="relative flex aspect-square items-center justify-center p-6">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}