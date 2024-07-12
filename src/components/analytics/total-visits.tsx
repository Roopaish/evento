"use client"

import { api } from "@/trpc/react"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const TotalVisits = () => {
  const { data: uniqueVisits } = api.event.getUniqueVisit.useQuery()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Web Visits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{uniqueVisits?.uniqueVisit}</div>
        <p className="text-xs text-muted-foreground"></p>
      </CardContent>
    </Card>
  )
}
