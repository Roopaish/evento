import { useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { type TicketInfo } from "@prisma/client"

import { cn } from "@/lib/utils"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import AddTicketTypes from "./add-ticket-types"
import TicketGrid from "./ticket-grid"

export default function TicketPage() {
  const [ticketInfo, setTicketInfo] = useState<TicketInfo[]>()
  const [ticketType, setTicketType] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [color, setColor] = useState<string>("")
  const [length, setLength] = useState<number>()
  const [width, setWidth] = useState<number>()

  function setValues(ticket: TicketInfo) {
    setTicketType(ticket.ticketType)
    setPrice(ticket.price)
    setColor(ticket.color)
  }

  const { data: ticketData } = api.ticket.getTicketBySessionEventId.useQuery()

  const ticketsInfo = ticketData?.map((ticket) => ({
    position: ticket.position.toString(),
    label: ticket.label,
    price: Number(ticket.price),
    color: ticket.color,
  }))

  useEffect(() => {
    setLength(Number(ticketData?.[0]?.length ?? 1))
    setWidth(Number(ticketData?.[0]?.width ?? 1))
  }, [ticketData])

  const { data } = api.ticket.getTicketInfoBySessionEventId.useQuery()

  useEffect(() => {
    if (data) {
      setTicketInfo(data)
    }
  }, [data])

  // useEffect(() => {
  //   console.log(ticketType, price, color, length, width)
  // }, [ticketType, price, color, length, width])

  return (
    <>
      <div className="mt-8">
        <RadioGroup>
          {ticketInfo?.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setValues(ticket)}
              className={cn(
                "mx-auto mt-4 flex h-9 w-full  cursor-pointer items-center gap-4 rounded-md border-2 border-gray-500 px-2 transition-all hover:border-green-500 hover:bg-gray-100",
                {
                  "border-green-500 bg-gray-100":
                    ticketType === ticket.ticketType,
                }
              )}
            >
              <RadioGroupItem
                style={{ backgroundColor: ticket.color }}
                className="h-5 w-5"
                value={ticket.id.toString()}
                id={ticket.id.toString()}
              />
              <Label htmlFor={ticket.id.toString()}>
                {ticket.ticketType} | Rs {ticket.price} per person
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <AddTicketTypes />
      <div className="mt-4 flex gap-2">
        <div className="flex w-[50%] flex-col gap-3">
          <Label>Length</Label>
          <Input
            type="number"
            value={length}
            min={0}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        <div className="flex w-[50%] flex-col gap-3">
          <Label>Width</Label>
          <Input
            type="number"
            value={width}
            min={0}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>
      </div>

      <TicketGrid
        length={length!}
        width={width!}
        label={ticketType}
        price={price}
        color={color}
        ticketsInfo={ticketsInfo!}
      />
    </>
  )
}
