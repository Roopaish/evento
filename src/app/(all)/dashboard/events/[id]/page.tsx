import { api } from "~/trpc/server"

import InviteMembersButton from "~/components/event/invite-members"

export default async function EventDetails({
  params,
}: {
  params: { id: string }
}) {
  const data = await api.event.getMyEvent.query({
    id: params.id,
  })

  return (
    <div>
      <InviteMembersButton />
      EventDetails
      {JSON.stringify(data)}
    </div>
  )
}
