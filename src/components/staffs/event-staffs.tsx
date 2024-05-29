"use client"

import { useCurrentEventStore } from "@/store/current-event-store"

import Reminder from "../common/reminder"

export default function EventStaffs() {
  const { currentEvent } = useCurrentEventStore()

  if (!currentEvent) {
    return <Reminder />
  }

  return <>Staffs</>
}
