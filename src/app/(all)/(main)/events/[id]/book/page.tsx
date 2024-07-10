"use client"

import { api } from "@/trpc/react"

import BookingHeader from "./booking-header"
import TicketBookingGrid from "./ticket-booking-grid"

export default function TicketBookPage({ params }: { params: { id: number } }) {
  const { data: ticketData, isLoading: isTicketDataLoading } =
    api.ticket.getTicketByEventId.useQuery({
      eventId: Number(params.id),
    })

  const { data: ticketInfo, isLoading: isTicketInfoLoading } =
    api.ticket.getTicketInfo.useQuery({
      eventId: Number(params.id),
    })
  console.log(ticketData)

  return (
    <>
      {isTicketDataLoading || isTicketInfoLoading ? (
        <div>Loading...</div>
      ) : null}
      {ticketInfo ? <BookingHeader ticketInfo={ticketInfo} /> : null}
      {ticketData ? <TicketBookingGrid ticketData={ticketData} /> : null}
    </>
  )
}
