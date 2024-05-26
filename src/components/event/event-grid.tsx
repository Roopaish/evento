"use client"

import { useEffect } from "react"
import { type api } from "@/trpc/react"

import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

import { Icons } from "../ui/icons"
import { EventCard } from "./event-card"

export default function EventGrid({
  queryOptions,
}: {
  queryOptions: ReturnType<typeof api.event.getUserEvents.useInfiniteQuery>
}) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  })

  const {
    data,
    isLoading: loading,
    isFetchingNextPage,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
  } = queryOptions

  const isLoading = loading || fetchStatus !== "idle"

  useEffect(() => {
    if (isIntersecting && !isLoading && !isFetchingNextPage && hasNextPage) {
      void fetchNextPage({})
    }
  }, [isIntersecting])

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[30px] lg:grid-cols-3 xl:grid-cols-4">
        {data?.pages?.map(
          (page) =>
            page?.data?.map((event) => (
              <div key={event.id} className="">
                <EventCard key={event.id} {...event} className="w-full" />
              </div>
            ))
        )}
      </div>
      <div
        className={cn(
          isFetchingNextPage || isLoading
            ? "flex items-center justify-center py-4"
            : "hidden"
        )}
      >
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
      {!isLoading &&
        (data?.pages?.length ?? 0) > 0 &&
        data?.pages?.[0]?.data?.length === 0 && (
          <div className="flex items-center justify-center py-4">
            <p>No events found.</p>
          </div>
        )}
      <div ref={ref} className="py-4"></div>
    </>
  )
}
