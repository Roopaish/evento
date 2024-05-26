"use client"

import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

import { type SearchSearchParams } from "@/lib/validations/search-filter-schema"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function SearchedEvents({
  initialData,
  searchParams,
  title,
}: {
  initialData?: RouterOutputs["event"]["getAll"]
  searchParams: SearchSearchParams
  title?: string
}) {
  const data = api.event.getAll.useInfiniteQuery(
    {
      ...searchParams,
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
