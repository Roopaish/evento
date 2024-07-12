"use client"

import { api } from "@/trpc/react"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Icons } from "../ui/icons"

export const TotalVisits = () => {
  const { data: uniqueVisits } = api.event.getUniqueVisit.useQuery()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
        <Icons.AArrowUp
          key={"totalvisit"}
          className="h-4 w-4 text-muted-foreground"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{uniqueVisits?.uniqueVisit}</div>
        <p className="text-xs text-muted-foreground"></p>
      </CardContent>
    </Card>
  )
}
