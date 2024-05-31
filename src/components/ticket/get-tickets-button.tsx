"use client"

import { api } from "@/trpc/react"

import { formatPrice } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../ui/button"
import { Text } from "../ui/text"
import TicketModel from "./ticket-model"

export default function GetTicketButton({ id }: { id: number }) {
  const { data } = api.event.getEvent.useQuery({
    id: Number(id),
  })

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="mt-2 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center space-x-2">
              <Text variant={"medium"} semibold className="text-gray-600">
                Event Ticket Price:
              </Text>
              <Text variant={"medium"} className="text-gray-800">
                {data?.price ? formatPrice(data.price) : "Free"}
              </Text>
            </div>
            <Button className="w-full"> Get ticket</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Your Ticket</DialogTitle>
            <DialogDescription>
              Fill in the details below to purchase your ticket.
            </DialogDescription>
            <TicketModel />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
