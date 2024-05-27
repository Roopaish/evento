import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import EventForm from "@/components/event/form/event-form"

export const metadata: Metadata = {
  title: "Add Event | " + siteConfig.name,
  description: siteConfig.description,
}

export default function EventFormPage() {
  return (
    <>
      <EventForm />
    </>
  )
}
