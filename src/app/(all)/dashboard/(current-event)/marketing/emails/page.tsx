import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import EmailsCampaign from "@/components/emails/email-campaign"

export const metadata: Metadata = {
  title: "Emails | " + siteConfig.name,
  description: siteConfig.description,
}

export default async function EmailPage() {
  return (
    <>
      <EmailsCampaign />
    </>
  )
}
