"use client"

import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"

import Reminder from "../common/reminder"
import { SubdomainDetails } from "./subdomain-details"
import { SubdomainSelector } from "./subdomain-selector"

export const WebsitePanel = () => {
  const { currentEvent } = useCurrentEventStore()

  const { data } = api.subdomain.getEventDomain.useQuery()
  console.log(data)
  if (!currentEvent) {
    return <Reminder />
  } else {
    if (data == null) {
      return (
        <div>
          <div>
            <SubdomainSelector></SubdomainSelector>
          </div>
        </div>
      )
    }
    return <SubdomainDetails data={data}></SubdomainDetails>
  }
}
