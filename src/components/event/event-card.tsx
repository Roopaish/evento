"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type Asset, type Event } from "@prisma/client"

import { cn, formatPrice } from "@/lib/utils"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { Icons } from "../ui/icons"
import { Text } from "../ui/text"

export function EventCard({
  title,
  date,
  address,
  className,
  assets,
  id,
  price,
}: Event & { className?: string; assets: Asset[] }) {
  const router = useRouter()

  return (
    <Link
      href={`/events/${id}`}
      className={cn(
        "group mx-auto flex h-full w-full flex-col overflow-hidden rounded-md bg-white shadow transition-all ease-in-out",
        className
      )}
    >
      <div className="relative">
        <Carousel className="group">
          <CarouselContent>
            {assets?.map((img) => (
              <CarouselItem key={img.id}>
                <Image
                  src={img.url.startsWith("http") ? img.url : "/hero.jpg"}
                  alt={title}
                  width={300}
                  height={300}
                  className="aspect-[1.5] h-full w-full cursor-pointer object-cover"
                  onClick={() => {
                    router.push(`/events/${id}`)
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 opacity-0 transition-opacity group-hover:opacity-100" />
          <CarouselNext className="right-2 opacity-0 transition-opacity group-hover:opacity-100" />
        </Carousel>
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <Text
          variant="medium"
          medium
          className="line-clamp-2 h-14 text-slate-700 group-hover:text-primary"
        >
          {title}
        </Text>

        <Text variant="normal" medium className="flex gap-2 text-slate-500">
          <Icons.MapPin className="mt-1 h-4 w-4 flex-shrink-0 stroke-primary" />{" "}
          <span className="line-clamp-2">{address}</span>
        </Text>
        <Text variant="normal" medium className="flex gap-2 text-slate-500">
          <Icons.Calendar className="mt-1 h-4 w-4 flex-shrink-0 stroke-primary" />{" "}
          <span className="line-clamp-2">{date?.toDateString()}</span>
        </Text>

        <Text variant="medium" className="mt-auto pt-4" semibold>
          {price ? formatPrice(price) : "Free"}
        </Text>
      </div>
    </Link>
  )
}
