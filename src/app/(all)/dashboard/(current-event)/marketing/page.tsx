import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { SubdomainSelector } from "@/components/marketing/subdomain-selector"

export const metadata: Metadata = {
  title: "Marketing | " + siteConfig.name,
  description: siteConfig.description,
}

export default function MarketingPage() {
  return (
    <>
      <SubdomainSelector />
    </>
  )
}
