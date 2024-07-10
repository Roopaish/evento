import { api } from "@/trpc/react"

export default function BookingList() {
  const { data: bookingData } = api.ticket.getBookedTickets.useQuery()

  return bookingData?.map((booking) => {
    return (
      <div key={booking.id}>
        <p>{booking?.user?.name}</p>
        <p>{booking?.event?.title}</p>
        <p>{booking.position}</p>
      </div>
    )
  })
}
