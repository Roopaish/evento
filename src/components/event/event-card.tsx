import Image from "next/image"
import Link from "next/link"
import { type Asset, type Event } from "@prisma/client"

import { cn } from "@/lib/utils"

export function EventCard({
  title,
  date,
  address,
  className,
  assets,
  id,
}: Event & { className?: string; assets: Asset[] }) {
  return (
    <Link
      href={`/events/${id}`}
      className={cn(
        "block w-full rounded-[5px] bg-white p-5 shadow",
        className
      )}
    >
      <figure className="w-full  overflow-hidden rounded-md ">
        <Image
          src={assets?.length > 0 ? assets[0]?.url ?? "/hero.jpg" : "/hero.jpg"}
          alt={title}
          height={350}
          width={350}
          className="h-64 w-full object-cover"
          quality={100}
        />
      </figure>
      <div className="mt-4 space-y-3 text-sm">
        <h3 className="text-lg font-semibold leading-none text-black">
          {title}
        </h3>

        <p className="text-xs font-normal text-primary">
          {date.toLocaleDateString()}
        </p>
        <p className="text-xs  font-normal text-muted-foreground">{address}</p>
      </div>
    </Link>
  )
}
