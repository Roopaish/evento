import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { TicketChart } from "@/components/analytics/ticket-chart"
import { TotalVisits } from "@/components/analytics/total-visits"

export const metadata: Metadata = {
  title: "Analytics | " + siteConfig.name,
  description: siteConfig.description,
}

export default function AnalyticsPage() {
  return (
    <>
      <TotalVisits></TotalVisits>
      <TicketChart></TicketChart>
    </>
  )
}
