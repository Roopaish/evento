"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

import CarouselImageViewer from "../common/carousel-image-viewer"

export default function EventCarousel({
  assets,
  title,
}: {
  assets: { url: string; id: string }[]
  title?: string
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div>
      <Carousel
        opts={{
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent hideOverflow>
          {assets?.map(({ url, id }, index) => (
            <CarouselItem
              key={id}
              className={cn(
                "flex aspect-square max-h-[400px] cursor-pointer items-center justify-center md:basis-1/2"
              )}
              onClick={() => setCurrentGalleryIndex(index)}
            >
              <Image
                src={url}
                alt={title ?? "Image"}
                height={500}
                width={1600}
                className={cn(
                  "w-full overflow-hidden rounded-xl border-2 object-cover transition-all duration-500",
                  index === current ? "h-full" : "h-[90%]"
                )}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-2 h-10 w-10  md:h-12 md:w-12"
          iconClassName="h-5 w-5 md:h-6 md:w-6 md:stroke-1"
        />
        <CarouselNext
          className="right-2 h-10 w-10  md:h-12 md:w-12"
          iconClassName="h-5 w-5 md:h-6 md:w-6 md:stroke-1"
        />
      </Carousel>
      <CarouselImageViewer
        open={!!currentGalleryIndex || currentGalleryIndex === 0}
        onOpenChange={(open) => {
          if (open) {
            setCurrentGalleryIndex(0)
          } else {
            setCurrentGalleryIndex(undefined)
          }
        }}
        images={assets}
        startIndex={currentGalleryIndex}
      />
    </div>
  )
}
