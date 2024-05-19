"use client"

import { api } from "@/trpc/react"

import { Separator } from "@/components/ui/separator"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function MyEvents() {
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

      <EventGrid events={data?.pages?.map((p) => p.data).flat() ?? []} />
    </>
  )
}
