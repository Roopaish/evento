import { useEffect, useState } from "react"
import { type EventType, type Ticket } from "@prisma/client"

import { cn } from "@/lib/utils"

import Checkout from "./checkout"

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

export default function TicketBookingGrid({
  ticketData,
}: {
  ticketData: TicketData[]
}) {
  const [ticketPositions, setTicketPositions] = useState<
    { position: string }[]
  >([])

  const [length, setLength] = useState<number>(1)
  const [width, setWidth] = useState<number>(1)

  useEffect(() => {
    if (ticketData) {
      ticketData?.map((ticket) => {
        if (ticket.position) {
          setLength(Number(ticket.length))
          setWidth(Number(ticket.width))
        }
      })
    }
  }, [ticketData])

  return (
    <>
      <div
        style={{
          gridTemplateColumns: `repeat(${length}, 1fr)`,
        }}
        className={`mb-10 mt-10 grid max-w-max gap-[4px] overflow-auto scroll-auto rounded-lg`}
      >
        {Array.from(
          {
            length: length * width,
          },
          (_, index) => {
            const containerId = `${index + 1}`
            const isSelected = ticketPositions.some(
              (p) => p.position === containerId
            )
            const isBooked = ticketData.some(
              (p) => p.position === Number(containerId) && p.isBooked
            )

            const isAvailable = ticketData.some(
              (p) => p.position === Number(containerId)
            )

            const isUserSelected = ticketData.some(
              (p) => p.position === Number(containerId) && p.isSelectedByUser
            )
            // console.log(isAvailable)
            // console.log(isBooked)
            // console.log(isSelected)
            // console.log("user selected", containerId, isUserSelected)
            return (
              <div
                style={{
                  width: 50,
                  height: 50,
                }}
                key={containerId}
              >
                <div
                  style={{
                    backgroundColor: isUserSelected
                      ? "gray"
                      : ticketData.filter(
                          (t) =>
                            t.position === Number(containerId) &&
                            !isSelected &&
                            !isBooked
                        )[0]?.color,
                  }}
                  className={cn(
                    `flex h-full cursor-pointer flex-col items-center justify-around gap-2 rounded-[8px] text-white transition duration-200 ease-in-out selection:bg-transparent`,
                    {
                      "hover:bg-red-800": !isSelected,
                      // "bg-slate-800": !isSelected && !isBooked,
                      "bg-green-500": isSelected,
                      "hover:bg-none pointer-events-none bg-gray-500": isBooked,
                      "pointer-events-none border border-black/80 text-white":
                        !isAvailable,
                      "pointer-events-none": isUserSelected,
                    }
                  )}
                  draggable={false}
                  key={index}
                  onClick={() => {
                    setTicketPositions((prev) =>
                      isSelected
                        ? prev.filter((p) => p.position !== containerId)
                        : [...prev, { position: containerId }]
                    )
                  }}
                >
                  {containerId}
                </div>
              </div>
            )
          }
        )}
      </div>
      <div className="mt-[100px] flex w-[90%] justify-end gap-2 p-4">
        {ticketPositions.length != 0 && (
          <Checkout ticketData={ticketData} ticketPositions={ticketPositions} />
        )}
      </div>
    </>
  )
}
