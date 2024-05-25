"use client"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function UpcomingEvents() {
  // TODO: show upcoming events

  return (
    <section className="container">
      <div>
        <Text variant={"h5"} semibold>
          Upcoming Events
        </Text>
      </div>
      <EventGrid events={[]} />
    </section>
  )
}
