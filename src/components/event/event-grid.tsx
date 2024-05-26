"use client"

import { useEffect } from "react"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

import { cn } from "@/lib/utils"
import { type SearchSearchParams } from "@/lib/validations/search-filter-schema"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

import { Icons } from "../ui/icons"
import { EventCard } from "./event-card"

export default function EventGrid({
  initialData,
  type = "all",
  userId,
  searchParams,
}: {
  initialData?: RouterOutputs["event"]["getAll"]
  type?: "user" | "me" | "all"
  userId?: string
  searchParams?: SearchSearchParams
}) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  })

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isFetchingNextPage: isFetchingNextUserPage,
    hasNextPage: hasNextUserPage,
    fetchNextPage: fetchNextUserPage,
    fetchStatus: fetchUserStatus,
  } = api.event.getUserEvents.useInfiniteQuery(
    {
      limit: 20,
      orderBy: "desc",
      sortBy: "created_at",
      userId,
    },
    {
      initialData:
        (type === "user" || type === "me") && initialData
          ? {
              pages: [initialData],
              pageParams: [""],
            }
          : undefined,
      enabled: type === "user" || type === "me",
    }
  )

  const {
    data: allData,
    isLoading: isAllLoading,
    isFetchingNextPage: isAllFetchingNextPage,
    hasNextPage: hasAllNextPage,
    fetchNextPage: fetchAllNextPage,
    fetchStatus: fetchAllStatus,
  } = api.event.getAll.useInfiniteQuery(
    {
      limit: 20,
      ...searchParams,
    },
    {
      initialData:
        type === "all" && initialData
          ? {
              pages: [initialData],
              pageParams: [""],
            }
          : undefined,
      enabled: type === "all",
    }
  )

  const data = userData ?? allData
  const isLoading =
    (isUserDataLoading && fetchUserStatus !== "idle") ??
    (isAllLoading && fetchAllStatus !== "idle")
  const isFetchingNextPage = isFetchingNextUserPage ?? isAllFetchingNextPage
  const hasNextPage = hasNextUserPage ?? hasAllNextPage
  const fetchNextPage = fetchNextUserPage ?? fetchAllNextPage

  useEffect(() => {
    if (isIntersecting && !isLoading && !isFetchingNextPage && hasNextPage) {
      void fetchNextPage({})
    }
  }, [isIntersecting])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
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
