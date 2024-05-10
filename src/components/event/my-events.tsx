"use client"

import { useRouter } from "next/navigation"
import { api } from "~/trpc/react"

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { EventCard } from "~/components/event/event-card"

import { Text } from "../ui/text"

export default function MyEvents() {
  const router = useRouter()
  const { data } = api.event.getMyEvents.useInfiniteQuery({
    limit: 10,
    orderBy: "asc",
    sortBy: "created_at",
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Text variant={"h6"}>My Events</Text>
          <Text>Events you have organized.</Text>
        </div>
      </div>
      <Separator className="my-4" />
      <ScrollArea>
        <div className="flex w-max space-x-4 p-4">
          {data?.pages?.map((p) =>
            p.data.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push(`/dashboard/events/${event.id}`)}
                className="cursor-pointer"
              >
                <EventCard
                  key={event.id}
                  img={event.assets[0]?.thumbnailUrl}
                  // eventDate={p.data}
                  eventName={event.title}
                  eventAddress={event.address}
                  className="w-64"
                />
              </div>
            ))
          )}
          {}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}
