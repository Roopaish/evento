"use client"

import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const TicketTypeDetails = () => {
  const { currentEvent: eventId } = useCurrentEventStore()
  const { data } = api.ticket.getTicketInfo.useQuery({
    eventId: Number(eventId),
  })

  const { data: data2 } = api.ticket.getTicketSalesByLabel.useQuery()
  console.log(data2)
  return (
    <div className="my-4 flex flex-row flex-wrap gap-4">
      {data?.map((elem) => (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Type: {elem.ticketType}
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="text-md font-bold">Price: Rs {elem.price}</div>
            <div className="text-md font-bold">
              Total Seats: {elem.totalSeats}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
