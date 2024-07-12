"use client"

import { api } from "@/trpc/react"

export const EventCount = ({ eventId }: { eventId: number }) => {
  api.event.updateUniqueVisit.useQuery(
    { eventId },
    {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  )

  return null
}
