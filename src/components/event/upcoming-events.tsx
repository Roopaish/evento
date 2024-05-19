"use client"

import EventGrid from "./event-grid"

export default function UpcomingEvents() {
  // TODO: show upcoming events

  return (
    <section className="container">
      <div>
        <span className=" text-3xl font-semibold text-black">Upcoming </span>
        <span className="text-3xl font-semibold text-purple-600">Events</span>
      </div>
      <EventGrid events={[]} onLoadMore={() => console.log("load more")} />
    </section>
  )
}
