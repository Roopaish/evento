"use client"

import { type Asset, type Event } from "@prisma/client"

import { Button } from "../ui/button"
import { EventCard } from "./event-card"

export default function EventGrid({
  events,
  onLoadMore,
}: {
  events: (Event & { assets: Asset[] })[]
  onLoadMore?: () => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} {...event} className="w-full" />
        ))}
      </div>
      {onLoadMore && (
        <div className="text-center ">
          <Button onClick={() => onLoadMore()}>Load More</Button>
        </div>
      )}
    </>
  )
}
