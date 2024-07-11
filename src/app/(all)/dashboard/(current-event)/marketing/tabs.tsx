"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Icons } from "@/components/ui/icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MarketingTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState("marketing")

  useEffect(() => {
    if (pathname.includes("emails")) {
      setValue("emails")
    } else {
      setValue("marketing")
    }
  }, [pathname])

  return (
    <Tabs
      defaultValue={value}
      onValueChange={(value) =>
        router.push(
          value === "marketing"
            ? `/dashboard/marketing`
            : `/dashboard/marketing/${value}`
        )
      }
    >
      <TabsList>
        <TabsTrigger value="marketing">
          <Icons.Globe className="h-4 w-4" />
          Your Web Domain
        </TabsTrigger>
        <TabsTrigger value="emails">
          <Icons.ClipboardCheck className="h-4 w-4" />
          Email Campaign
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
