"use client"

import { useState } from "react"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { Button } from "../ui/button"
import TicketPanel from "./ticket-panel"

export default function InviteMembersButton({ eventId }: { eventId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger className="w-full p-2">
          <Button className="w-full">Map Tickets</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-h-full sm:min-w-full">
          {/* <DialogHeader> */}
          {/* <DialogTitle>Set Tickets</DialogTitle> */}
          {/* <DialogDescription></DialogDescription> */}
          {/* </DialogHeader> */}
          <TicketPanel eventId={eventId} onCancel={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
