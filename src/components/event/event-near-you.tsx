"use client"

import { Text } from "../ui/text"
import EventGrid from "./event-grid"

export default function EventsNearYou() {
  // TODO: Show events near the user's location

  return (
    <section className="container">
      <div>
        <Text variant={"h5"} semibold>
          Events Near You
        </Text>
      </div>
      <EventGrid events={[]} />
    </section>
  )
}
