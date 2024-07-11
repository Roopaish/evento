import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"
import { api } from "@/trpc/server"
import { TemplateChosen } from "@prisma/client"

import { formatPrice, getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import EventCarousel from "@/components/event/event-carousel"
import InviteMembersButton from "@/components/event/invite-members"
import ShareEvent from "@/components/event/share-event"
import JobPositionsDetail from "@/components/job/job-positions-details"

export default async function EventDetails({
  params,
}: {
  params: {
    subdomain: string
  }
}) {
  const session = await getServerAuthSession()

  const event = await api.subdomain.getLinkedEvent.query({
    subdomain: params.subdomain,
  })

  const data = await api.event.getEvent.query({
    id: Number(event?.eventId),
  })

  const isCreatedByMe = session?.user?.id === data?.createdById

  if (!event?.eventId || !data) {
    redirect("/404")
  }

  return (
    <div className="pb-10 pt-10">
      <div className="container">
        {event?.templateChosen !== TemplateChosen.Template1 ? (
          <EventCarousel assets={data?.assets ?? []} title={data?.title} />
        ) : (
          <div className="w-full overflow-hidden rounded-md bg-bar p-4">
            <Image
              src={data?.assets[0]?.url ?? ""}
              alt={data?.title}
              width={1920}
              height={1080}
              className="max-h-[500px] w-full object-contain"
            />
          </div>
        )}

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
              {data?.category && (
                <Badge className="mb-2 block max-w-max">{data?.category}</Badge>
              )}

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
                  Price:
                </span>
                <p className="text-lg text-gray-800">
                  {data?.price ? formatPrice(data?.price) : "Free"}
                </p>
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

            <JobPositionsDetail
              jobPositions={data?.jobPositions}
              isCreatedByMe={isCreatedByMe}
            />
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
              {/* <div className="flex h-64 items-center justify-center rounded-lg bg-gray-300">
                <span className="text-gray-700">Map Here </span>
              </div> */}
            </div>

            {isCreatedByMe && (
              <>
                <div className="my-2">
                  <Link href={`/dashboard/events/${data?.id}/edit`}>
                    <Button className="w-full" variant={"outline"}>
                      Edit Event
                    </Button>
                  </Link>
                </div>

                <div className="my-2">
                  <InviteMembersButton eventId={event?.eventId} />
                </div>
              </>
            )}

            {!isCreatedByMe && (
              <>
                <div className="my-2">
                  <Link href={`/events/${data?.id}/book`}>
                    <Button className="w-full">Get Tickets</Button>
                  </Link>
                </div>
              </>
            )}

            <div className="mt-5">
              <ShareEvent />
            </div>

            {data?.tags?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold">Tags</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data?.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:bg-primary-100"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
