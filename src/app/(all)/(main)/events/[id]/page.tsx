import { api } from "@/trpc/server"

import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import EventCarousel from "@/components/event/event-carousel"
import EventGrid from "@/components/event/event-grid"
import InviteMembersButton from "@/components/event/invite-members"
import ShareEvent from "@/components/event/share-event"

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
      <div className="container py-8">
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
        />
        <div className="flex justify-between ">
          <div className=" m-6 flex flex-col space-y-2 md:mt-10">
            <Text as="h1" variant={"h4"} medium className="font-serif">
              {data?.title}
            </Text>
            {/* <Text as="h1" variant={"h4"} medium className="font-serif">
            📅 {data?.date}
            </Text> */}
            <Text variant={"medium"} medium className="mt-10 font-serif">
              {data?.description}
            </Text>
            <p>{data?.capacity}</p>
            <p>{data?.address}</p>
          </div>
          <div>
            <div className="md:max-w-screen mt-5 w-full px-6 sm:px-4 ">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Event Location</h2>
              </div>
              <div className="rounded-lg bg-gray-100 p-4 ">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Lokanthali,Ram Mandir</h3>
                  <p>Bhaktapur, Nepal</p>
                </div>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-300">
                  <span className="text-gray-700">Map Rakhne </span>
                </div>
              </div>
            </div>
            <div className="">
              <ShareEvent />
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="space-y-5">
          <Text variant={"h6"} semibold className="mb-5">
            More Events like this
          </Text>
          <EventGrid />
        </div>
        <div>
          <InviteMembersButton />
        </div>
        <div className="mb-6">{JSON.stringify(data)}</div>
      </div>
    </>
  )
}
