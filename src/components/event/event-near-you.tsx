"use client"

import EventGrid from "./event-grid"

export default function EventsNearYou() {
  // TODO: Show events near the user's location

  return (
    <section className="container">
      <div>
        <span className=" text-3xl font-semibold text-black">Events </span>
        <span className="text-3xl font-semibold text-purple-600">Near You</span>
      </div>
      <EventGrid events={[]} onLoadMore={() => console.log("load more")} />
    </section>
  )
}
