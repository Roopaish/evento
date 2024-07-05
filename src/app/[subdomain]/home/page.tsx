"use server"

import { useState } from "react"
import Error from "next/error"
import { api } from "@/trpc/server"

const EventWebsite = ({ event }: { event: string }) => {
  return (
    <div>
      <div></div>
      <div></div>
    </div>
  )
}

export default function HomeDomain() {
  const subdomain = document.location.hostname.split(".")[0]
  if (subdomain) {
    const data = api.subdomain.checkAvailable.query({ url: subdomain })
    console.log(data)
    return <div>{subdomain}</div>
  }
}
