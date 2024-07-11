"use client"

import { api } from "@/trpc/react"

import { SubdomainDetails } from "./subdomain-details"
import { SubdomainSelector } from "./subdomain-selector"

export const WebsitePanel = () => {
  const { data, isLoading } = api.subdomain.getEventDomain.useQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <SubdomainSelector />
  }

  return <SubdomainDetails data={data}></SubdomainDetails>
}
