"use client"

import { useEffect, useState } from "react"
import { api } from "@/trpc/react"

import { Checkbox } from "@/components/ui/checkbox"
import TicketDisplayForm from "@/components/book/byform/ticket-display-form"
import BookingHeader from "@/components/book/bymapping/booking-header"
import TicketBookingGrid from "@/components/book/bymapping/ticket-booking-grid"

export default function TicketBookPage({ params }: { params: { id: number } }) {
  const [enablemap, setEnableMap] = useState<boolean>(false)
  const [hasMap, setHasMap] = useState<boolean>(false)

  const { data: ticketData, isLoading: isTicketDataLoading } =
    api.ticket.getTicketByEventId.useQuery({
      eventId: Number(params.id),
    })

  const { data: ticketInfo, isLoading: isTicketInfoLoading } =
    api.ticket.getTicketInfo.useQuery({
      eventId: Number(params.id),
    })

  useEffect(() => {
    if (ticketData) {
      ticketData?.map((ticket) => {
        if (ticket.position) {
          setHasMap(true)
        }
      })
    }
  }, [ticketData])

  // const { data: savedTicketInfo, isLoading: isSavedTicketInfoLoading } =
  //   api.ticket.getSavedTicketInfo.useQuery({
  //     eventId: Number(params.id),
  //   })

  return (
    <>
      {isTicketDataLoading || isTicketInfoLoading ? (
        <div>Loading...</div>
      ) : null}
      {ticketInfo ? <BookingHeader ticketInfo={ticketInfo} /> : null}
      <TicketDisplayForm ticketInfo={ticketInfo!} ticketData={ticketData!} />
      {hasMap && (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={enablemap}
            id="mapping"
            onClick={() => {
              setEnableMap(!enablemap)
            }}
          />
          <label
            htmlFor="mapping"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable seat mapping
          </label>
        </div>
      )}
      {enablemap && ticketData ? (
        <TicketBookingGrid ticketData={ticketData} />
      ) : null}
    </>
  )
}
