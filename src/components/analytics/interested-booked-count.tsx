"use client"

import { api } from "@/trpc/react"
import { toast } from "sonner"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"

export const InterestedCount = ({ eventId }: { eventId: number }) => {
  const { data: interested, refetch } = api.event.getInterested.useQuery({
    eventId: Number(eventId),
  })
  console.log(interested + "ssss")

  const { data: alreadyBooked } = api.ticket.getTicketCount.useQuery({
    eventId: Number(eventId),
  })

  const { mutateAsync, isLoading, data } = api.event.setInterested.useMutation({
    onSuccess() {
      toast.success("Increased Count")
      void refetch()
    },
  })

  return (
    <div>
      <div>
        {" "}
        <span>
          <b>Interested in Going: </b>

          {interested ?? "wassup"}
        </span>{" "}
        <span>
          <b>Already Booked:</b>
          {alreadyBooked ?? "Wassup"}
        </span>
      </div>
      <div>
        <Button
          onClick={() => {
            void mutateAsync({
              eventId: Number(eventId),
            })
          }}
          disabled={!!data}
        >
          {isLoading && <Icons.spinner className="animate-spin" />}
          Also Interested
        </Button>
      </div>
    </div>
  )
}
