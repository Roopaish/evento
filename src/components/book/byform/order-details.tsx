import Image from "next/image"
import { type RouterOutputs } from "@/trpc/shared"

import { Separator } from "@/components/ui/separator"

export default function OrderDetails({
  bookedTicketData,
  totalSeats,
  imageUrl,
}: {
  bookedTicketData: RouterOutputs["ticket"]["getTicketInfo"][0]
  totalSeats: number
  imageUrl: string
}) {
  return (
    <div className="m-2 p-2">
      <div>
        {bookedTicketData && (
          <Image
            className="rounded-lg"
            src={imageUrl}
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
            <div>Price per ticket</div>
            <div>total seats</div>
            <div>Sub Total</div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div>{bookedTicketData?.ticketType}</div>
            <div>Rs. {bookedTicketData?.price}</div>
            <div className="flex w-[80px] flex-wrap items-center justify-center gap-2">
              {totalSeats}
            </div>
          </div>
          <div>Rs. {bookedTicketData?.price * totalSeats}</div>
        </div>
        <Separator className="mt-5" />
        <div className="mt-5 flex justify-around gap-2">
          <div className="text-xl font-semibold text-gray-900"> Total</div>
          <div></div>
          <div className="font-medium text-gray-900">
            Rs. {bookedTicketData?.price * totalSeats}
          </div>
        </div>
      </div>
    </div>
  )
}
