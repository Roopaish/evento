import Image from "next/image"

type IconProps = React.HTMLAttributes<SVGElement>

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
    <>
      <div className={className}>
        <figure className="w-full overflow-hidden rounded-md ">
          <Image
            src={img}
            alt={eventName}
            height={250}
            width={250}
            className="h-64 w-full object-cover"
          />
        </figure>
        <div className="space-y-1 text-sm">
          <p className="text-xs text-muted-foreground">{eventDate}</p>
          <h3 className="font-medium leading-none">{eventName}</h3>
          <p className="text-xs text-muted-foreground">{eventAddress}</p>
        </div>
      </div>
    </>
  )
}
