import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { AppliedJobTable } from "@/components/job/user-job-application"

export const metadata: Metadata = {
  title: "JobBoard | " + siteConfig.name,
  description: siteConfig.description,
}

export default function StaffsPage() {
  return (
    <>
      <AppliedJobTable />
    </>
  )
}
