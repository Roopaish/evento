import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { WebsitePanel } from "@/components/marketing/website-panel"

export const metadata: Metadata = {
  title: "Marketing | " + siteConfig.name,
  description: siteConfig.description,
}

export default function MarketingPage() {
  return (
    <>
      <WebsitePanel></WebsitePanel>
    </>
  )
}
