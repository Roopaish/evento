"use client"

import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

import { Separator } from "@/components/ui/separator"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function UserEvents({
  initialData,
  userId,
  title,
  subtitle,
}: {
  initialData?: RouterOutputs["event"]["getAll"]
  userId: string
  title?: string
  subtitle?: string
}) {
  const data = api.event.getUserEvents.useInfiniteQuery(
    {
      limit: 20,
      orderBy: "desc",
      sortBy: "created_at",
      userId,
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
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {title && <Text variant={"h6"}>{title}</Text>}
          {subtitle && <Text>{subtitle}</Text>}
        </div>
      </div>
      <Separator className="my-4" />

      <EventGrid queryOptions={data} />
    </>
  )
}
