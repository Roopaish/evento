"use client"

import { useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { type TicketInfo } from "@prisma/client"

import { cn } from "@/lib/utils"

import { Checkbox } from "../ui/checkbox"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Text } from "../ui/text"
import AddTicketTypes from "./add-ticket-types"
import EditTicket from "./edit-tickettype"
import TicketGrid from "./ticket-grid"

export default function Tickets() {
  const [ticketType, setTicketType] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [seats, setSeats] = useState<number>(0)
  const [color, setColor] = useState<string>("")
  const [length, setLength] = useState<number>()
  const [width, setWidth] = useState<number>()
  const [enablemap, setEnableMap] = useState<boolean>(false)

  function setValues(ticket: TicketInfo) {
    setTicketType(ticket.ticketType)
    setPrice(ticket.price)
    setColor(ticket.color)
    setSeats(Number(ticket.totalSeats))
  }

  const utils = api.useUtils()

  const { data: ticketData } = api.ticket.getTicketBySessionEventId.useQuery()

  const ticketsInfo = ticketData?.map((ticket) => ({
    position: Number(ticket.position).toString(),
    label: ticket.label,
    price: Number(ticket.price),
    color: ticket.color,
  }))

  useEffect(() => {
    console.log("ticketData", ticketData)
    if (ticketData?.length == 0) {
      setEnableMap(false)
    } else {
      setEnableMap(true)
    }
    setLength(Number(ticketData?.[0]?.length ?? 1))
    setWidth(Number(ticketData?.[0]?.width ?? 1))
  }, [ticketData])

  const { data: ticketInfo } =
    api.ticket.getTicketInfoBySessionEventId.useQuery()

  const { mutateAsync: deleteTicket } =
    api.ticket.deleteTicketInfo.useMutation()

  const deleteTicketInfo = (id: number) => async () => {
    await deleteTicket(
      { ticketId: Number(id) },
      {
        onSuccess: () => {
          void utils.ticket.getTicketInfoBySessionEventId.refetch()
        },
      }
    )
  }
  // useEffect(() => {
  //   console.log(ticketType, price, color, length, width)
  // }, [ticketType, price, color, length, width])

  return (
    <>
      <div className="rounded-sm border px-4 py-2">
        <Text variant={"large"} medium className="mb-2">
          Ticket Types
        </Text>
        <RadioGroup>
          {ticketInfo?.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setValues(ticket)}
              className={cn(
                "mx-auto flex  w-full cursor-pointer items-center gap-4 rounded-md transition-all"
              )}
            >
              <RadioGroupItem
                className="h-5 w-5"
                value={ticket.id.toString()}
                id={ticket.id.toString()}
              />
              <div className="flex w-full justify-between">
                <Label
                  htmlFor={ticket.id.toString()}
                  className="flex cursor-pointer items-center capitalize"
                >
                  <div
                    className="mr-2 inline-block h-4 w-4 rounded-sm"
                    style={{ backgroundColor: ticket.color }}
                  ></div>
                  {ticket.ticketType}, Rs {ticket.price}/per person, totalSeats:{" "}
                  {ticket.totalSeats}
                </Label>
                <div className="flex gap-5">
                  {ticket && <EditTicket {...ticket} />}

                  <Icons.Trash
                    onClick={deleteTicketInfo(ticket.id)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        <AddTicketTypes />
      </div>

      {ticketInfo?.length !== 0 && (
        <>
          <div className="mt-6 flex items-center space-x-2">
            <Checkbox
              checked={enablemap}
              id="mapping"
              onClick={() => {
                setEnableMap(!enablemap)
              }}
            />
            <label
              htmlFor="mapping"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable seat mapping
            </label>
          </div>

          <div className="mt-4 flex  items-center gap-2">
            <Label>Grid Size:</Label>
            <div className="flex w-32 flex-col gap-3">
              <Input
                type="number"
                value={length}
                min={0}
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>
            X
            <div className="flex w-32 flex-col gap-3">
              <Input
                type="number"
                value={width}
                min={0}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>
          </div>
          {enablemap && ticketsInfo && (
            <TicketGrid
              length={length!}
              width={width!}
              label={ticketType}
              price={price}
              color={color}
              totalSeats={seats}
              ticketsInfo={ticketsInfo}
            />
          )}
        </>
      )}
    </>
  )
}
