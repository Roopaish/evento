"use client"

import { Separator } from "@/components/ui/separator"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function MyEvents() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Text variant={"h6"}>My Events</Text>
          <Text>Events you have organized.</Text>
        </div>
      </div>
      <Separator className="my-4" />

      <EventGrid type="me" />
    </>
  )
}
