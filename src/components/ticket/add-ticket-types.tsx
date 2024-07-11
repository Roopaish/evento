"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import TicketForm from "./ticket-form"

export default function AddTicketTypes() {
  const [isOpen, setIsOpen] = useState(false)

  function onCancel() {
    setIsOpen(false)
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger className="mt-5 p-2">
          <Button size="default">
            <Icons.Plus />
            Add Ticket Type
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle></DialogTitle> */}
            <DialogDescription>
              Add Ticket Type here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <TicketForm onCancel={onCancel} />
        </DialogContent>
      </Dialog>
    </>
  )
}
