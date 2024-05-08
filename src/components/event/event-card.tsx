import Image from "next/image"

import { cn } from "~/lib/utils"

export interface EventProps {
  id: string
  title: string
  date: Date
  address: string
}

export function EventCard({
  title,
  address,
  className,
  date,
}: EventProps & { className?: string }) {
  return (
    <div className={cn("w-full rounded-[5px] bg-white p-5 shadow", className)}>
      <figure className="w-full overflow-hidden rounded-md ">
        <Image
          src={"/logo.png"}
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
          {JSON.stringify(date)}
        </p>
        <p className="text-xs  font-normal text-muted-foreground">{address}</p>
      </div>
    </div>
  )
}
