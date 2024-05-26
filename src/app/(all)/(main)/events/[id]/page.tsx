import { api } from "@/trpc/server"

import EventCarousel from "@/components/event/event-carousel"
import InviteMembersButton from "@/components/event/invite-members"

export default async function EventDetails({
  params,
}: {
  params: { id: number }
}) {
  const data = await api.event.getEvent.query({
    id: Number(params.id),
  })

  return (
    <>
      <div className="container">
        <EventCarousel assets={data?.assets ?? []} title={data?.title} />{" "}
      </div>
      <div>
        <InviteMembersButton />
        {JSON.stringify(data)}
      </div>
    </>
  )
}
