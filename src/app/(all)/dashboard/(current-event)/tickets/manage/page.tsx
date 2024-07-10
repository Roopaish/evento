import { type Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Manage Ticket | " + siteConfig.name,
  description: siteConfig.description,
}

export default function ManageTicketPage() {
  return <>Manage Tickets: Price, SeatMapping</>
}
