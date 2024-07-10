import { type Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Emails | " + siteConfig.name,
  description: siteConfig.description,
}

export default function EmailsPage() {
  return <>Emails</>
}
