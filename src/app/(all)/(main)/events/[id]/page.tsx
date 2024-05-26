import { api } from "@/trpc/server"

import EventCarousel from "@/components/event/event-carousel"
import InviteMembersButton from "@/components/event/invite-members"
import JobPositionsDetail from "@/components/event/job-positions-details"

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
        <EventCarousel
          assets={[
            {
              url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
              id: "eventdetail",
            },
            {
              url: "https://www.oyorooms.com/blog/wp-content/uploads/2018/02/type-of-event.jpg",
              id: "eventdetail2",
            },
            {
              url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
              id: "eventdetail3",
            },
          ]}
          title={data?.title}
        />{" "}
      </div>

      <div>
        <JobPositionsDetail jobPositions={data?.jobPositions} />
      </div>
      <div>
        <InviteMembersButton />
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  )
}
