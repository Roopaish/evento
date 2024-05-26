"use client"

import { api } from "@/trpc/react"
import { type RouterInputs, type RouterOutputs } from "@/trpc/shared"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function AllEvents({
  initialData,
  title,
  filters,
}: {
  initialData?: RouterOutputs["event"]["getAll"]
  title?: string
  type?: "upcoming" | "near-you" | "recommended"
  idToRecommendFor?: number
  filters?: RouterInputs["event"]["getAll"]
}) {
  const data = api.event.getAll.useInfiniteQuery(
    {
      ...filters,
      limit: filters?.limit ?? 4,
    },
    {
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [""],
          }
        : undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  return (
    <section className="container">
      {title && (
        <Text variant={"h5"} semibold className="mb-5">
          {title}
        </Text>
      )}
      <EventGrid queryOptions={data} shouldPaginate={false} />
    </section>
  )
}
