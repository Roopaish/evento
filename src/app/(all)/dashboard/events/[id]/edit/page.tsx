import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import EventForm from "@/components/event/form/event-form"

export const metadata: Metadata = {
  title: "Edit Event | " + siteConfig.name,
  description: siteConfig.description,
}

export default function EditEventFormPage({
  params,
}: {
  params: { id: number }
}) {
  return (
    <>
      <EventForm id={Number(params.id)} />
    </>
  )
}
