import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import BookingList from "@/components/ticket/booking-list"

export const metadata: Metadata = {
  title: "Tickets | " + siteConfig.name,
  description: siteConfig.description,
}

export default function TicketsPage() {
  return (
    <>
      <BookingList />
    </>
  )
}
