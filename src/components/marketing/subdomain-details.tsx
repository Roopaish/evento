import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"
import { SubdomainSelector } from "./subdomain-selector"
import { WebsiteTemplate } from "./website-template"

export const SubdomainDetails = ({
  data,
}: {
  data: RouterOutputs["subdomain"]["getEventDomain"]
}) => {
  return (
    <div>
      <div className="flex flex-1  rounded-md border-2 border-lime-200 p-4">
        <div className="">
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
          <Dialog>
            <DialogTrigger>Edit</DialogTrigger>
            <DialogContent>
              <DialogHeader>Change Subdomain Details</DialogHeader>
              <DialogDescription>
                <SubdomainSelector type="update"></SubdomainSelector>
              </DialogDescription>
            </DialogContent>
          </Dialog>
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
      <WebsiteTemplate data={eventDetails}></WebsiteTemplate>
    </div>
  )
}
