import Image from "next/image"

import { cn } from "~/lib/utils"

export type EventCardProps = {
  img: string
  eventDate: string
  eventName: string
  eventAddress: string
}

export function EventCard({
  img,
  eventDate,
  eventName,
  eventAddress,
  className,
}: EventCardProps & { className?: string }) {
  return (
    <div className={cn("w-full rounded-[5px] bg-white p-5 shadow", className)}>
      <figure className="w-full overflow-hidden rounded-md ">
        <Image
          src={img}
          alt={eventName}
          height={350}
          width={350}
          className="h-64 w-full object-cover"
          quality={100}
        />
      </figure>
      <div className="mt-4 space-y-3 text-sm">
        <h3 className="text-lg font-semibold leading-none text-black">
          {eventName}
        </h3>

        <p className="text-xs font-normal text-primary">{eventDate}</p>
        <p className="text-xs  font-normal text-muted-foreground">
          {eventAddress}
        </p>
      </div>
    </div>
  )
}
