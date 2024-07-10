export default function BookingHeader({
  ticketInfo,
}: {
  ticketInfo: { label: string; color: string; price: string }[]
}) {
  return (
    <>
      <div className="mx-auto mt-[150px] min-h-[80px] w-[90%] rounded-lg bg-gray-100 p-3 md:mt-[100px]">
        <div className="mb-2 grid grid-cols-3 items-center gap-2">
          {ticketInfo?.map((ticket) => (
            <div key={ticket.label} className="flex items-center gap-4">
              <div
                style={{ backgroundColor: ticket.color }}
                className="h-4 w-4 rounded-sm"
              ></div>
              <div>
                {ticket.label} | Rs{ticket.price}/per person{" "}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="h-4 w-4 rounded-sm bg-green-500"></div>
            <div>Selected</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-4 rounded-sm bg-gray-500"></div>
            <div>Unavailable</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-4 rounded-sm bg-purple-500"></div>
            <div>Booked</div>
          </div>
        </div>
      </div>
    </>
  )
}
