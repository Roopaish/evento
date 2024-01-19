import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { EventCard, type EventCardProps } from "~/components/event-card"

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
          <p className="text-sm text-muted-foreground">
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
      {/* <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Made for You</h2>
        <p className="text-sm text-muted-foreground">
          Your personal playlists. Updated daily.
        </p>
      </div>
      <Separator className="my-4" />
      </ */}
    </>
  )
}

const events: EventCardProps[] = [
  {
    img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437",
    eventDate: "02/02/2024",
    eventName: "Nepal Youth protest",
    eventAddress: "Balkumari Lalitpur",
  },
  {
    img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437",
    eventDate: "02/09/2024",
    eventName: "nepal News Conference",
    eventAddress: "Gwarko ,Imadol,Lalitpur",
  },
  {
    img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437",
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
    img: "https://images.unsplash.com/photo-1682687981603-ae874bf432f2",
    eventDate: "02/09/2024",
    eventName: "nepal News Conference",
    eventAddress: "Gwarko ,Imadol,Lalitpur",
  },
]
