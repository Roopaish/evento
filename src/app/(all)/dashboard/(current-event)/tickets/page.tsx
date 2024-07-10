import { type Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Tickets | " + siteConfig.name,
  description: siteConfig.description,
}

export default function TicketsPage() {
  return <>Tickets</>
}
