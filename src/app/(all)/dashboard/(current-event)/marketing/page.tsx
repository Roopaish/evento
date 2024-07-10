import { type Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Marketing | " + siteConfig.name,
  description: siteConfig.description,
}

export default function MarketingPage() {
  return <>Marketing</>
}
