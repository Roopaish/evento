"use client"

import { api } from "@/trpc/react"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableCell, TableHead, TableRow } from "../ui/table"
import { Text } from "../ui/text"

export default function BookingList() {
  const { data } = api.ticket.getBookedTickets.useQuery()

  return (
    <>
      <div className="mt-10">
        <Text variant={"medium"} className="mb-4" medium>
          Ticket Analytics
        </Text>
        <div className="mb-10 grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Booked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.bookedTickets?.length}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.remainingTickets}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalSales}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <Text variant={"medium"} className="mb-4" medium>
          Ticket Booking List
        </Text>

        <Table className="rounded-sm border">
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>TicketType</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>

          {data?.bookedTickets?.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No booked ticket found
              </TableCell>
            </TableRow>
          )}

          {data?.bookedTickets?.map((data) => {
            return (
              <TableRow>
                <TableCell>{data.event?.title}</TableCell>
                <TableCell>{data.label}</TableCell>
                <TableCell>{data.price}</TableCell>
                <TableCell>{data.user?.email}</TableCell>
                <TableCell>{data.user?.name}</TableCell>
              </TableRow>
            )
          })}
        </Table>
      </div>
    </>
  )
}
