import { useState } from "react"
import { type RouterOutputs } from "@/trpc/shared"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Checkout from "./checkout"

export default function TicketDisplayForm({
  ticketInfo,
}: {
  ticketInfo: RouterOutputs["ticket"]["getTicketInfo"]
}) {
  const [ticketType, setTicketType] = useState<string>("")
  const [seats, setSeats] = useState<number>(0)

  const selectedTicketData = ticketType
    ? ticketInfo?.find((ticket) => ticket.ticketType === ticketType)
    : null

  if (selectedTicketData && seats > selectedTicketData?.totalSeats) {
    toast.error("Seats should be less than avaibale seats")
  }

  return (
    <div className="mt-5 border-gray-400">
      <div className="mb-3 text-2xl font-semibold">Choose Ticket</div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Select Ticket Type</Label>

          <Select onValueChange={setTicketType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ticket Type" />
            </SelectTrigger>
            <SelectContent>
              {ticketInfo
                ?.filter((t) => t.totalSeats != 0)
                .map((ticket, index) => (
                  <SelectItem value={ticket.ticketType} key={index}>
                    {ticket.ticketType}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Select number of seats</Label>
          <div className="flex gap-3">
            <Input
              type="number"
              min={1}
              max={selectedTicketData?.totalSeats}
              value={seats}
              onChange={(e) => {
                setSeats(Number(e.target.value))
              }}
              placeholder="Number of seats"
            />
            {selectedTicketData ? (
              <div>Available:{selectedTicketData?.totalSeats}</div>
            ) : null}
          </div>
        </div>
        {ticketType &&
          seats > 0 &&
          selectedTicketData &&
          seats <= selectedTicketData.totalSeats && (
            <Checkout selectedTicket={selectedTicketData} totalSeats={seats} />
          )}
      </div>
    </div>
  )
}
