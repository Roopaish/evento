import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { EventCard, type EventCardProps } from "~/components/event-card"

export default function ManageEvents() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className=" text-lg font-medium tracking-tight">Events</h2>
          <p className="text-sm font-normal text-muted-foreground  ">
            Events you have organized.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <ScrollArea>
        <div className="flex w-max space-x-4 p-4">
          {events.map(({ img, eventDate, eventName, eventAddress }) => (
            <EventCard
              key={eventName}
              img={img}
              eventDate={eventDate}
              eventName={eventName}
              eventAddress={eventAddress}
              className="w-64"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}

const events: EventCardProps[] = [
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3PFSiWiG7MsMbtSWL06eAIMVcxKmG9pW4qQ&usqp=CAU",
    eventDate: "02/02/2024",
    eventName: "Nepal Youth protest",
    eventAddress: "Balkumari Lalitpur",
  },
  {
    img: "https://localmedia.org/wp-content/uploads/2021/06/events-1.png",
    eventDate: "02/09/2024",
    eventName: "nepal News Conference",
    eventAddress: "Gwarko ,Imadol,Lalitpur",
  },
  {
    img: "https://craftworldevents.com/wp-content/uploads/2022/10/Corporate-Events.jpg",
    eventDate: "22/03/2023",
    eventName: "25th ceremony",
    eventAddress: "Maitighar, kathmandu",
  },
  {
    img: "https://images.unsplash.com/photo-1682687981603-ae874bf432f2",
    eventDate: "02/09/2024",
    eventName: "nepal News Conference",
    eventAddress: "Gwarko ,Imadol,Lalitpur",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ_oF0StLxphzj9x2xykS-Fk7GXGmkCl43RA&usqp=CAU",
    eventDate: "02/09/2024",
    eventName: "nepal News Conference",
    eventAddress: "Gwarko ,Imadol,Lalitpur",
  },
]
