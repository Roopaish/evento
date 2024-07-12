"use client"

import { api } from "@/trpc/react"
import { differenceInDays, parseISO } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const DaysToGo = () => {
  const { data } = api.event.getEventDate.useQuery()

  const dateToday = new Date()
  let dateDifference
  if (data?.date) {
    // Assuming data.date is in ISO format, otherwise adjust accordingly
    const eventDate = parseISO(data?.date.toISOString())

    // Calculate the difference in days
    dateDifference = differenceInDays(eventDate, dateToday)

    console.log(`Difference in days: ${dateDifference}`)
  } else {
    console.log("No date found in the data.")
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Event Date</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data?.date.toDateString()}</div>

        <p className="text-xs text-muted-foreground">
          {(dateDifference ?? 0) > 0
            ? `Days Remaing:${dateDifference} Days`
            : "Event Ended"}
        </p>
      </CardContent>
    </Card>
  )
}
