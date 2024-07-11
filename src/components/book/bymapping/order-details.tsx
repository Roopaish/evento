import Image from "next/image"
import { type EventType, type Ticket } from "@prisma/client"

import { Separator } from "@/components/ui/separator"

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

export default function OrderDetails({
  bookedTicketData,
}: {
  bookedTicketData: TicketData[]
}) {
  function groupByLabelWithPositions(ticketData: TicketData[]) {
    const groupedData: Record<
      string,
      { label: string; price: string; positions: number[] }
    > = {}

    ticketData.forEach((item) => {
      const { position, label, price } = item
      if (!groupedData[label]) {
        groupedData[label] = {
          label,
          price,
          positions: [],
        }
      }
      groupedData[label]?.positions.push(Number(position))
    })

    return Object.values(groupedData).map(({ label, price, positions }) => [
      positions,
      label,
      price,
    ])
  }

  const groupedByLabelWithPositions =
    groupByLabelWithPositions(bookedTicketData)

  return (
    <div className="m-2 p-2">
      <div>
        {bookedTicketData && (
          <Image
            className="rounded-lg"
            src={bookedTicketData[0]?.event?.assets[0]?.url ?? ""}
            width={300}
            height={300}
            alt="ticket"
          />
        )}
      </div>
      <div className="mt-5">
        <h1 className="mb-3 font-medium text-gray-900">Order Summary</h1>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-5">
          <div className="flex justify-around gap-2 font-medium text-gray-500">
            <div>Ticket Type</div>
            <div>Seat No.</div>
            <div>Sub Total</div>
          </div>
          {groupedByLabelWithPositions.map(([positions, label, price]) => (
            <div key={Number(label)}>
              <div className="flex items-center justify-around gap-2">
                <div>{label}</div>
                <div className="flex w-[80px] flex-wrap items-center justify-center gap-2">
                  {Array.isArray(positions) &&
                    positions.map((position) => (
                      <div key={Number(position)}>
                        {position}
                        {positions.indexOf(position) == positions.length - 1
                          ? ""
                          : ","}
                      </div>
                    ))}
                </div>
                <div>Rs. {Number(price) * positions!.length}</div>
              </div>
            </div>
          ))}
        </div>
        <Separator className="mt-5" />
        <div className="mt-5 flex justify-around gap-2">
          <div className="text-xl font-semibold text-gray-900">Total</div>
          <div></div>
          <div className="font-medium text-gray-900">
            Rs.{" "}
            {groupedByLabelWithPositions.reduce(
              (acc, [positions, , price]) =>
                acc + Number(price) * positions!.length,
              0
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
