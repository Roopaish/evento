import { cookies } from "next/headers"

import Reminder from "@/components/common/reminder"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const event = cookies().get("event")?.value

  if (!event) {
    return <Reminder />
  }

  return <>{children}</>
}
