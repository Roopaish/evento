"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingList from "@/components/ticket/booking-list"
import TicketPage from "@/components/ticket/ticket-page"

export default function Tickets() {
  return (
    <Tabs defaultValue="bookings" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          className="data-[state=active]:bg-green-700 data-[state=active]:text-white"
          value="bookings"
        >
          Bookings
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-green-700 data-[state=active]:text-white"
          value="Ticket Mapping"
        >
          Ticket Mapping
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bookings">
        <BookingList />
      </TabsContent>
      <TabsContent value="Ticket Mapping">
        <TicketPage />
      </TabsContent>
    </Tabs>
  )
}
