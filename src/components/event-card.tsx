import Image from "next/image"

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
            height={350}
            width={350}
            className="h-64 w-full object-cover"
            quality={100}
          />
        </figure>
        <div className=" space-y-1 text-sm">
          <p className="  mt-4 text-xs font-normal text-muted-foreground">
            {eventDate}
          </p>
          <h3 className=" my-[6px] text-sm font-medium leading-none">
            {eventName}
          </h3>
          <p className=" mb-4 text-xs  font-normal text-muted-foreground">
            {eventAddress}
          </p>
        </div>
      </div>
    </>
  )
}
