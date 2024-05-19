import CreateNewEventBanner from "@/components/ctas/create-new-event-banner"
import EventsNearYou from "@/components/event/event-near-you"
import UpcomingEvents from "@/components/event/upcoming-events"
import HeroCarousel from "@/components/home/hero-carousel"
import SearchFilters from "@/components/search/search-filters"

export default async function Home() {
  return (
    <div>
      <HeroCarousel />
      <SearchFilters />
      <EventsNearYou />
      <div className="mt-8">
        <EventsNearYou />
      </div>
      <div className="mt-8">
        <UpcomingEvents />
      </div>
      <CreateNewEventBanner />
    </div>
  )
}
