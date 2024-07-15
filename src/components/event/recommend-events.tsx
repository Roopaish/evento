import { recommendation } from "@/server/recommend-script/helper"
import { api } from "@/trpc/server"

import { Text } from "../ui/text"
import { EventCard } from "./event-card"

export default async function RecommendEvents({
  pageTitle,
  titleToRecommendFor,
}: {
  type?: "content-based" | "collaborative-filtering"
  pageTitle?: string
  idToRecommendFor?: number
  titleToRecommendFor: string
}) {
  // if (type === "content-based") {
  const recommendEventIds = await recommendation(titleToRecommendFor)

  // console.log({recommendEventIds})
  // const ids = recommendEventIds.map((id) => Number(id))
  // convert recommendEventIds to an array of numbers
  const ids: number[] = []

  recommendEventIds.forEach((id) => {
    if (id) {
      if (typeof Number(id) === "number") ids.push(Number(id))
    }
  })

  const events = await api.event.getEventByIds.query(ids)
  // console.log("events", events)

  return (
    <section className="container">
      {pageTitle && (
        <Text variant={"h5"} semibold className="mb-5">
          {pageTitle}
        </Text>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[30px] lg:grid-cols-3 xl:grid-cols-4">
        {events?.map((event) => (
          <div key={event.id} className="">
            <EventCard key={event.id} {...event} className="w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
