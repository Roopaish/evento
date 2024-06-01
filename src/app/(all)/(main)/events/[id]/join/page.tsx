import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import InvitationHandler from "@/components/event/invitation-handler"

export default async function EventJoin({
  params,
  searchParams,
}: {
  params: { id: number }
  searchParams: { token: string }
}) {
  const session = await getServerAuthSession()

  if (!session?.user) {
    redirect(
      `/login?next=/events/${params.id}/join?token=${searchParams.token}&&msg=You need to be logged in to join the event`
    )
  }

  return (
    <div className="container">
      <InvitationHandler />
    </div>
  )
}
