import Link from "next/link"
import { getServerAuthSession } from "@/server/auth"
import { api } from "@/trpc/server"

import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import AllEvents from "@/components/event/all-events"
import EventCarousel from "@/components/event/event-carousel"
import InviteMembersButton from "@/components/event/invite-members"
import ShareEvent from "@/components/event/share-event"
import JobPositionsDetail from "@/components/job/job-positions-details"

export default async function EventDetails({
  params,
}: {
  params: { id: number }
}) {
  const session = await getServerAuthSession()

  const data = await api.event.getEvent.query({
    id: Number(params.id),
  })

  return (
    <div className="pb-10 pt-10">
      <div className="container">
        <EventCarousel assets={data?.assets ?? []} title={data?.title} />

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 my-6 flex flex-col space-y-4 md:mt-10 lg:col-span-2">
            <div className="flex items-center space-x-2 text-lg text-gray-600">
              <span role="img" aria-label="calendar">
                📅
              </span>
              <Text variant="medium" medium className="font-semibold">
                {data?.date?.toDateString()}
              </Text>
            </div>

            <Text
              as="h1"
              variant="h4"
              medium
              className="text-2xl font-bold text-gray-800"
            >
              {data?.title}
            </Text>
            <Text variant="medium" medium className="mt-4 text-gray-700">
              {data?.description}
            </Text>

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-600">
                  Capacity:
                </span>
                <p className="text-lg text-gray-800">{data?.capacity}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-600">
                  Address:
                </span>
                <p className="text-lg text-gray-800">{data?.address}</p>
              </div>

              <div>
                <Separator className="my-10" />
              </div>

              <div className="flex gap-2">
                <Avatar className="h-14 w-14 rounded-full ">
                  <AvatarImage
                    src={`${data.managerImage?.url}`}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {getInitials(data.managerName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <div className="ml-4">
                    <div className="text-lg font-medium">
                      Event Manage by {data.managerName}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div>{data.managerPhone}</div>
                      {data.managerEmail && <span>-</span>}
                      <div>{data.managerEmail}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <JobPositionsDetail jobPositions={data?.jobPositions} />
          </div>

          <div className="col-span-3 mt-5 px-4 sm:px-2 lg:col-span-1">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Event Location</h2>
            </div>
            <div className="rounded-lg bg-gray-100 p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">{data?.address}</h3>
                {/* <p>{data?.lat}</p> */}
              </div>
              <div className="flex h-64 items-center justify-center rounded-lg bg-gray-300">
                <span className="text-gray-700">Map Here </span>
              </div>
            </div>

            {session?.user?.id === data?.createdById && (
              <>
                <div className="my-2">
                  <Link href={`/dashboard/events/${data?.id}/edit`}>
                    <Button className="w-full" variant={"outline"}>
                      Edit Event
                    </Button>
                  </Link>
                </div>

                <div className="my-2">
                  <InviteMembersButton eventId={params.id} />
                </div>
              </>
            )}

            <div className="mt-5">
              <ShareEvent />
            </div>
          </div>
        </div>

        <Separator className="my-10" />
      </div>

      <AllEvents idToRecommendFor={params.id} title="Recommended Events" />
    </div>
  )
}
