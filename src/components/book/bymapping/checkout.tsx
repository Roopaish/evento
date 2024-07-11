"use client"

import { useState } from "react"
import { api } from "@/trpc/react"
import { type EventType, type Ticket } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import OrderDetails from "./order-details"
import TicketBookingForm from "./ticket-booking-form"
import CountdownTimer from "./timer"

interface TicketData extends Ticket {
  event: {
    title: string
    type: EventType
    date: Date
    address: string
    assets: {
      url: string
      thumbnailUrl: string
    }[]
  }
}

export default function Checkout({
  ticketData,
  ticketPositions,
}: {
  ticketData: TicketData[]
  ticketPositions: { position: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()
  const { mutate: deSelectTicket } = api.ticket.deSelectTicket.useMutation()

  const { data: user } = api.user.getUser.useQuery()

  const bookedTicketData = ticketData.filter((p) =>
    ticketPositions.some(
      (t) => Number(t.position) === Number(p.position) && !p.isBooked
    )
  )

  console.log(bookedTicketData)
  function onCancel() {
    deSelectTicket({
      position: ticketPositions.map((ticket) => ticket.position),
      eventId: Number(ticketData[0]?.eventId),
    })
    setIsOpen(false)
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            deSelectTicket(
              {
                position: ticketPositions.map((ticket) => ticket.position),
                eventId: Number(ticketData[0]?.eventId),
              },
              {
                onSuccess: () => {
                  void utils.ticket.getTicketByEventId.refetch()
                },
              }
            )
          }
          setIsOpen(open)
        }}
      >
        <DialogTrigger className="mt-5 p-2">
          <Button size="lg" className="w-full">
            Checkout
          </Button>
        </DialogTrigger>
        <DialogContent className="h-full max-w-[80%]">
          {/* <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader> */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr,1fr] md:grid-rows-[1fr,10fr]">
            <div className="md:col-span-2">
              <CountdownTimer
                initialSeconds={300}
                onCancel={onCancel}
                eventId={Number(ticketData[0]?.eventId)}
                ticketPositions={ticketPositions}
              />
            </div>
            <TicketBookingForm
              user={user!}
              bookedTicketData={bookedTicketData}
              onCancel={onCancel}
            />
            <OrderDetails bookedTicketData={bookedTicketData} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
