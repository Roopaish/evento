"use client"

import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

export default function HeroCarousel() {
  return (
    <section className="container">
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {["/home-page.jpg", "/auth-bg.jpg"].map((img, index) => (
              <CarouselItem key={index}>
                {" "}
                <figure className="h-[500px] overflow-hidden rounded-[10px]">
                  <Image
                    className="h-full w-full object-cover "
                    src={img}
                    alt="home page"
                    width={1320}
                    height={596}
                  ></Image>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        <h2 className="absolute left-0  right-0 top-16 text-center text-4xl font-semibold text-white"></h2>
      </div>
    </section>
  )
}
