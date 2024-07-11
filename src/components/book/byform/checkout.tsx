"use client"

import { useState } from "react"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import OrderDetails from "./order-details"
import TicketBookingForm from "./ticket-booking-form"
import CountdownTimer from "./timer"

export default function Checkout({
  selectedTicket,
  totalSeats,
}: {
  selectedTicket: RouterOutputs["ticket"]["getTicketInfo"][0]
  totalSeats: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: user } = api.user.getUser.useQuery()
  const { data: event } = api.event.getEvent.useQuery({
    id: selectedTicket.eventId,
  })

  function onCancel() {
    setIsOpen(false)
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
      >
        <DialogTrigger className="mt-5 p-2">
          <Button size="lg" className="w-full">
            Checkout
          </Button>
        </DialogTrigger>
        <DialogContent className=" max-w-[80%]">
          {/* <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader> */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr,1fr] md:grid-rows-[1fr,10fr]">
            <div className="md:col-span-2">
              <CountdownTimer initialSeconds={300} onCancel={onCancel} />
            </div>
            <TicketBookingForm
              user={user!}
              totalSeats={totalSeats}
              selectedTicket={selectedTicket}
              onCancel={onCancel}
            />
            <OrderDetails
              bookedTicketData={selectedTicket}
              totalSeats={totalSeats}
              imageUrl={event?.assets[0]?.url ?? ""}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
