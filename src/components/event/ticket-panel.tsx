"use client"

import { useEffect, useState } from "react"
import { api } from "@/trpc/react"

import { Input } from "@/components/ui/input"

import TicketGrid from "./ticket-grid"

export default function TicketPanel({
  eventId,
  onCancel,
}: {
  eventId: number
  onCancel: () => void
}) {
  const [grid, setGrid] = useState<number>(1)
  const [price, setPrice] = useState<number>(0)
  const [label, setLabel] = useState<string>("")
  const [color, setColor] = useState<string>("#326d22")

  const { data: ticketData } = api.ticket.getTicketByEventId.useQuery(
    { eventId: Number(eventId) }
    // {
    //   enabled: !!eventId,
    // }
  )

  const ticketInfo = ticketData?.map((ticket) => ({
    position: ticket.position.toString(),
    label: ticket.label,
    price: Number(ticket.price),
    color: ticket.color,
  }))

  useEffect(() => {
    setGrid(ticketData?.[0]?.grid ?? 1)
  }, [ticketData])

  return (
    <div className="mt-8 flex flex-col justify-items-center gap-6">
      <div className="mb-6 flex flex-col justify-center gap-6">
        <Input
          type="number"
          min={1}
          placeholder="Number of tickets"
          value={grid}
          onChange={(e) => setGrid(Number(e.target.value))}
        />

        <Input
          type="text"
          placeholder="Ticket Type"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <Input
          type="number"
          min={0}
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
        />

        <Input
          type="color"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <TicketGrid
        grid={grid}
        label={label}
        color={color}
        price={price}
        eventId={eventId}
        onCancel={onCancel}
        ticketInfo={ticketInfo!}
      />
    </div>
  )
}
