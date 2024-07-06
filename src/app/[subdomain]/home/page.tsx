import { headers } from "next/headers"
import { api } from "@/trpc/server"

const EventWebsite = ({ subdomain }: { subdomain: string }) => {
  return (
    <div>
      <div>{subdomain}</div>
      <div></div>
    </div>
  )
}

export default async function HomeDomain() {
  const host = headers().get("host")
  const subdomain = host?.split(".")[0]
  console.log(subdomain)
  if (!subdomain || subdomain == undefined) {
    return <div>Invalid Route</div>
  }
  const data = await api.subdomain.checkAvailable.query({
    url: subdomain,
  })
  console.log(data)
  if (data) {
    return <EventWebsite subdomain={subdomain}></EventWebsite>
  } else {
    return <div>Sub Domain Available</div>
  }
}

// To do: Add Backend for Creating Subdomain
//        Frontrnf for Creating and displaying subdomain
//        Add Themeing solution for frontend
//        Integrate Scoaial Media
