import Link from "next/link"
import { type RouterOutputs } from "@/trpc/shared"

import { URL_ORIGIN, URL_PREFIX } from "@/config/constants"

export const SubdomainDetails = ({
  data,
}: {
  data: RouterOutputs["subdomain"]["getEventDomain"]
}) => {
  return (
    <div>
      <div className="rounded-md border-2 border-lime-200 p-4">
        <div className="">
          You Already Have Registered a Website for this Event
        </div>
        <div className="flex space-x-5">
          <span>
            <b>Subdomain:</b>
            <Link
              href={`${URL_PREFIX}//${data?.route}.${URL_ORIGIN}`}
              className="underline"
              target={"_blank"}
            >
              {data?.route}.{URL_ORIGIN}
            </Link>
          </span>
          <span>
            <b>Theme:</b> {data?.templateChosen}
          </span>
        </div>
      </div>
    </div>
  )
}
