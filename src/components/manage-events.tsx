"use client"

import { api } from "~/trpc/react"

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { EventCard } from "~/components/event-card"

export default function ManageEvents() {
  const { data } = api.event.getMyEvents.useInfiniteQuery({
    limit: 10,
    orderBy: "asc",
    sortBy: "created_at",
  })

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
          {data?.pages?.map((p) =>
            p.data.map((event) => (
              <EventCard
                key={event.id}
                img={event.assets[0]?.thumbnailUrl}
                // eventDate={p.data}
                eventName={event.title}
                eventAddress={event.address}
                className="w-64"
              />
            ))
          )}
          {}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}
