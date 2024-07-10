import { type Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Analytics | " + siteConfig.name,
  description: siteConfig.description,
}

export default function AnalyticsPage() {
  return <>Analytics</>
}
