import { useState } from "react"
import { type RouterOutputs } from "@/trpc/shared"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import EditTicketForm from "./edit-tickettype-form"

export default function EditTicket(
  props: RouterOutputs["ticket"]["getTicketInfoBySessionEventId"][0]
) {
  // const { id, ticketType, price, color } = props
  const [isOpen, setIsOpen] = useState(false)

  function onCancel() {
    setIsOpen(false)
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger>
          <Icons.Edit className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle></DialogTitle> */}
            <DialogDescription>
              Add Ticket Type here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <EditTicketForm onCancel={onCancel} ticketInfo={props} />
        </DialogContent>
      </Dialog>
    </>
  )
}
