import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import EventStaffs from "@/components/staffs/event-staffs"

export const metadata: Metadata = {
  title: "Staffs | " + siteConfig.name,
  description: siteConfig.description,
}

export default function StaffsPage() {
  return (
    <>
      <EventStaffs />
    </>
  )
}
