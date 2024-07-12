import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { TotalVisits } from "@/components/analytics/total-visits"

export const metadata: Metadata = {
  title: "Analytics | " + siteConfig.name,
  description: siteConfig.description,
}

export default function AnalyticsPage() {
  return (
    <>
      <TotalVisits></TotalVisits>
    </>
  )
}
