import Image from "next/image"
import { type Asset, type Event } from "@prisma/client"

import { cn } from "@/lib/utils"

export function EventCard({
  title,
  date,
  address,
  className,
  assets,
}: Event & { className?: string; assets: Asset[] }) {
  return (
    <div className={cn("w-full rounded-[5px] bg-white p-5 shadow", className)}>
      <figure className="w-full overflow-hidden rounded-md ">
        <Image
          src={assets?.length > 0 ? assets[0]?.url ?? "/logo.png" : "/logo.png"}
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
    </div>
  )
}
