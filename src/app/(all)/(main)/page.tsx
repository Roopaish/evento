import { cn } from "@/lib/utils"
import { Text } from "@/components/ui/text"
import CreateNewEventBanner from "@/components/ctas/create-new-event-banner"
import AllEvents from "@/components/event/all-events"
import SearchFilters from "@/components/search/search-filters"

export default async function Home() {
  return (
    <div className="space-y-24 pb-10">
      <div>
        <div
          className={cn(
            "relative bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat pb-40 pt-10"
          )}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container relative text-center text-white">
            <Text variant={"h2"} semibold className="mt-10 text-center">
              Event Management Simplified
            </Text>
            <Text variant={"large"} className="mx-auto mt-4 max-w-3xl">
              Create, manage, publish, and staff your events effortlessly.
            </Text>
          </div>
        </div>

        <div className="mx-auto -mt-20">
          <SearchFilters />
        </div>
      </div>

      <AllEvents type="upcoming" title="Upcoming Events" />

      <AllEvents type="near-you" title="Events Near You" />

      <CreateNewEventBanner />
    </div>
  )
}
