import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import Tickets from "@/components/ticket"

export const metadata: Metadata = {
  title: "Manage Ticket | " + siteConfig.name,
  description: siteConfig.description,
}

export default function ManageTicketPage() {
  return (
    <>
      <Tickets />
    </>
  )
}
