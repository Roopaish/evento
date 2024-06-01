"use client"

import { useCurrentEventStore } from "@/store/current-event-store"

import Reminder from "../common/reminder"
import { JobApplicationDetails } from "../job/job-application-details"
import { Separator } from "../ui/separator"
import EventParticipants from "./event-participants"

export default function EventStaffs() {
  const { currentEvent } = useCurrentEventStore()

  if (!currentEvent) {
    return <Reminder />
  }

  return (
    <>
      <EventParticipants />
      <Separator className="my-10" />
      <JobApplicationDetails></JobApplicationDetails>
    </>
  )
}
