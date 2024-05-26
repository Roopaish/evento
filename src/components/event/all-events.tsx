"use client"

import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function AllEvents({
  initialData,
  title,
}: {
  initialData?: RouterOutputs["event"]["getAll"]
  title?: string
  type?: "upcoming" | "near-you" | "recommended"
  idToRecommendFor?: number
}) {
  const data = api.event.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [""],
          }
        : undefined,
    }
  )

  return (
    <section className="container">
      {title && (
        <Text variant={"h5"} semibold>
          {title}
        </Text>
      )}
      <EventGrid queryOptions={data} />
    </section>
  )
}
