"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Icons } from "@/components/ui/icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TicketsTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState("tickets")

  useEffect(() => {
    if (pathname.includes("manage")) {
      setValue("manage")
    } else {
      setValue("tickets")
    }
  }, [pathname])

  return (
    <Tabs
      defaultValue={value}
      onValueChange={(value) =>
        router.push(
          value === "tickets"
            ? `/dashboard/tickets`
            : `/dashboard/tickets/${value}`
        )
      }
    >
      <TabsList>
        <TabsTrigger value="tickets">
          <Icons.Users className="h-4 w-4" />
          Tickets
        </TabsTrigger>
        <TabsTrigger value="manage">
          <Icons.ClipboardCheck className="h-4 w-4" />
          Manage Tickets
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
