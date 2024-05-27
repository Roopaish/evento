import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Text } from "@/components/ui/text"
import UserEvents from "@/components/event/user-events"

export default async function Dashboard() {
  const session = await getServerAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Text semibold variant={"h6"}>
          Your Events
        </Text>

        <Link href="/dashboard/events/add">
          <Button size="lg">
            <Icons.Plus />
            Create New Event
          </Button>
        </Link>
      </div>
      <UserEvents userId={session?.user?.id} />
    </div>
  )
}
