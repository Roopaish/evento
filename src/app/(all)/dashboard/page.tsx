import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import UserEvents from "@/components/event/user-events"

export default async function Dashboard() {
  const session = await getServerAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <>
      <div className="container">
        <Link href="/dashboard/events/add">
          <Button size="lg">
            <Icons.Plus />
            Add Event
          </Button>
        </Link>
      </div>
      <UserEvents userId={session?.user?.id} />
    </>
  )
}
