import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { type SearchSearchParams } from "@/lib/validations/search-filter-schema"
import { Text } from "@/components/ui/text"
import EventGrid from "@/components/event/event-grid"
import SearchFilters from "@/components/search/search-filters"

export const metadata: Metadata = {
  title: "Search | " + siteConfig.name,
  description: siteConfig.description,
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchSearchParams
}) {
  return (
    <>
      <div>
        <div
          className={cn(
            "relative bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat pb-40 pt-10"
          )}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="container relative text-center text-white">
            <Text variant={"h3"} semibold className="mt-10 text-center">
              {searchParams.q
                ? `Search results for "${searchParams.q}"`
                : "Find your next event"}
            </Text>
          </div>
        </div>

        <div className="mx-auto -mt-20">
          <SearchFilters />
        </div>
      </div>

      <div className="mt-10">
        <EventGrid type="all" searchParams={searchParams} />
      </div>
    </>
  )
}
