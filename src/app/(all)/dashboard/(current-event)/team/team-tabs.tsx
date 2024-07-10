"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Icons } from "@/components/ui/icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeamTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState("staffs")

  useEffect(() => {
    if (pathname.includes("staffs")) {
      setValue("staffs")
    } else if (pathname.includes("tasks")) {
      setValue("tasks")
    } else if (pathname.includes("chats")) {
      setValue("chats")
    }
  }, [pathname])

  return (
    <Tabs
      defaultValue={value}
      onValueChange={(value) => router.push(`/dashboard/team/${value}`)}
    >
      <TabsList>
        <TabsTrigger value="staffs">
          <Icons.Users className="h-4 w-4" />
          Staffs
        </TabsTrigger>
        <TabsTrigger value="tasks">
          <Icons.ClipboardCheck className="h-4 w-4" />
          Tasks
        </TabsTrigger>
        <TabsTrigger value="chats">
          <Icons.MessageCircle className="h-4 w-4" />
          Chats
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
