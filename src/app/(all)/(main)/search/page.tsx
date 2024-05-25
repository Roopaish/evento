import { type Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Search | " + siteConfig.name,
  description: siteConfig.description,
}

export default function SearchPage() {
  return <>Search</>
}
