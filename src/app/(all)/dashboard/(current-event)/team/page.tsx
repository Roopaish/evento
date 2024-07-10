import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { Separator } from "@/components/ui/separator"
import { JobApplicationDetails } from "@/components/job/job-application-details"
import EventParticipants from "@/components/staffs/event-participants"

export const metadata: Metadata = {
  title: "Team | " + siteConfig.name,
  description: siteConfig.description,
}

export default function TeamPage() {
  return (
    <>
      <EventParticipants />

      <Separator className="my-10" />

      <JobApplicationDetails />
    </>
  )
}
