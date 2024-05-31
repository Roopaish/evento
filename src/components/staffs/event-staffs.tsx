"use client"

import { useCurrentEventStore } from "@/store/current-event-store"

import Reminder from "../common/reminder"
import { JobApplicationDetails } from "../job/job-application-details"

export default function EventStaffs() {
  const { currentEvent } = useCurrentEventStore()

  if (!currentEvent) {
    return <Reminder />
  }

  return (
    <>
      <JobApplicationDetails
        user={{ name: "Kushal", cv: "asdasdsadasdasd" }}
      ></JobApplicationDetails>
    </>
  )
}
