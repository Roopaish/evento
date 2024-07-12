"use client"

import { api } from "@/trpc/react"

import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Text } from "@/components/ui/text"

export default function MyOrders() {
  const { data } = api.ticket.getMyTickets.useQuery()

  console.log(data)
  return (
    <>
      <div className="mt-6">
        <Text variant={"medium"} className="mb-4" medium>
          My Tickets
        </Text>

        <Table className="rounded-sm border">
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>TicketType</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Biiling Information</TableHead>
          </TableRow>

          {data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No booked ticket found
              </TableCell>
            </TableRow>
          )}

          {data?.map((data) => {
            return (
              <TableRow>
                <TableCell>{data?.event?.title}</TableCell>
                <TableCell>
                  {data?.event?.date.toString().slice(0, 10)}
                </TableCell>
                <TableCell>{data?.label}</TableCell>
                <TableCell>{data?.price}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-4">
                    <div>
                      {data?.bookingUser?.firstName}{" "}
                      {data?.bookingUser?.lastName}
                    </div>
                    <div>{data.bookingUser?.email}</div>
                    <div>{data.bookingUser?.phone}</div>
                  </div>
                </TableCell>
                {/* <TableCell>{data?.user?.name}</TableCell> */}
              </TableRow>
            )
          })}
        </Table>
      </div>
    </>
  )
}
