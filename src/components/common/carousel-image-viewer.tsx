import Image from "next/image"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
} from "@/components/ui/extension/carousel"

export default function CarouselImageViewer({
  open,
  onOpenChange,
  images = [],
  startIndex,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  images: { url: string; id: string }[]
  startIndex?: number
}) {
  return (
    <Dialog open={open} modal onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-[100vw] border-none bg-transparent"
        iconClassName="text-white md:h-8 md:w-8"
      >
        <Carousel
          carouselOptions={{
            loop: true,
            startIndex: startIndex,
          }}
          className="px-5"
        >
          <CarouselPrevious
            className="left-2 h-10 w-10  md:h-12 md:w-12"
            iconClassName="h-5 w-5 md:h-6 md:w-6 md:stroke-1"
          />
          <CarouselNext
            className="right-2 h-10 w-10  md:h-12 md:w-12"
            iconClassName="h-5 w-5 md:h-6 md:w-6 md:stroke-1"
          />
          <CarouselMainContainer className="max-h-[90vh] w-full">
            {images.map(({ id, url }) => (
              <SliderMainItem key={id} className="bg-transparent">
                <figure className="flex size-full items-center justify-center rounded-xl">
                  <Image
                    src={url}
                    alt={"ok"}
                    width={1600}
                    height={900}
                    className="h-full w-full object-contain"
                  />
                </figure>
              </SliderMainItem>
            ))}
          </CarouselMainContainer>
          {/* <CarouselThumbsContainer>
            {images.map(({ fileId, url }, index) => (
              <SliderThumbItem
                key={fileId}
                index={index}
                className="aspect-video bg-transparent"
              >
                <div className="flex cursor-pointer items-center justify-center overflow-hidden rounded-sm bg-background outline outline-1 outline-border">
                  <Image
                    src={url}
                    alt={"ok"}
                    width={600}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              </SliderThumbItem>
            ))}
          </CarouselThumbsContainer> */}
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
