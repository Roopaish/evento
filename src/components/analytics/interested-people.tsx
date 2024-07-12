"use client"

import { api } from "@/trpc/react"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const InterestedPeople = () => {
  const { data } = api.event.getAnalyticsInterested.useQuery()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Interested People</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data}</div>

        <p className="text-xs text-muted-foreground"></p>
      </CardContent>
    </Card>
  )
}
