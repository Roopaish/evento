import { type Metadata } from "next"
import { api } from "@/trpc/server"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  // TODO: Generate title and description based on the event
  title: "Event | " + siteConfig.name,
  description: siteConfig.description,
}

export default async function EventDetails({
  params,
}: {
  params: { slug: number }
}) {
  const data = await api.event.getEvent.query({ id: params.slug })

  return (
    <div>
      {params.slug}
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* TODO: Image Carousel */}
      {/* TODO: Event title, address, time */}
      {/* TODO: Event description in rich text format */}
      {/* TODO: About Event Manager (name, email and phone number) */}
      {/* TODO: Job Postings, Open modal to apply for job */}
    </div>
  )
}
