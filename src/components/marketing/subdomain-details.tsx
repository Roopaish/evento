import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

export const SubdomainDetails = ({
  data,
}: {
  data: RouterOutputs["subdomain"]["getEventDomain"]
}) => {
  return (
    <div>
      <div className="rounded-md border-2 border-lime-200 p-4">
        <div className="">
          You Already Have Registerd a Website for this Event
        </div>
        <div className="flex space-x-5">
          <span>
            <b>Subdomain:</b> {data?.route}.localhost:3000/home
          </span>
          <span>
            <b>Theme:</b> {data?.templateChosen}
          </span>
        </div>
      </div>
      <div>
        <SubdomainPreview subdomain={data?.route}></SubdomainPreview>
      </div>
    </div>
  )
}

const SubdomainPreview = ({ subdomain }: { subdomain?: string }) => {
  if (subdomain == null) {
    return <div>Invalid Domain</div>
  }
  const { data: event } = api.subdomain.getLinkedEvent.useQuery({
    subdomain,
  })
  console.log(event)
  const { data: eventDetails, isLoading } = api.event.getEvent.useQuery({
    id: event?.eventId ?? 0,
  })

  if (isLoading) {
    return <>Loading...</>
  }

  if (!eventDetails?.id) {
    return <div>Event Doesnot Exist</div>
  }

  return (
    <div>
      {
        //Website Tempate here
      }
    </div>
  )
}
