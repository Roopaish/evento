import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { DaysToGo } from "@/components/analytics/days-to-go"
import { InterestedPeople } from "@/components/analytics/interested-people"
import { TicketChart } from "@/components/analytics/ticket-chart"
import { TicketTypeDetails } from "@/components/analytics/ticket-type-analytics"
import { TotalVisits } from "@/components/analytics/total-visits"

export const metadata: Metadata = {
  title: "Analytics | " + siteConfig.name,
  description: siteConfig.description,
}

export default function AnalyticsPage() {
  return (
    <>
      <div className="flex flex-row flex-wrap gap-4">
        <TotalVisits></TotalVisits>
        <DaysToGo></DaysToGo>
        <InterestedPeople></InterestedPeople>
      </div>

      <div className="">
        <TicketChart></TicketChart>
        <TicketTypeDetails></TicketTypeDetails>
      </div>
    </>
  )
}
