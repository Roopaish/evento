"use client"

import { api } from "@/trpc/react"

import { Table, TableCell, TableHead, TableRow } from "../ui/table"
import { Text } from "../ui/text"

export const AppliedJobTable = () => {
  const { data } = api.jobs.getAppliedApplications.useQuery()

  return (
    <div className="container">
      <Text variant={"medium"} className="mb-4" medium>
        Applied Jobs
      </Text>

      <Table className="rounded-sm border">
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied at</TableHead>
        </TableRow>

        {data?.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No job applications found
            </TableCell>
          </TableRow>
        )}

        {data?.map(({ id, status, jobPosition, createdAt }) => {
          return (
            <TableRow>
              <TableCell>{id}</TableCell>
              <TableCell>{jobPosition.title}</TableCell>

              <TableCell>
                {status == "REJECTED" ? (
                  <div className="font-extrabold text-red-400">{status}</div>
                ) : status == "ACCEPTED" ? (
                  <div className="font-extrabold text-green-400">{status}</div>
                ) : (
                  <div className="font-extrabold text-orange-400">{status}</div>
                )}
              </TableCell>
              <TableCell>{createdAt.toTimeString()}</TableCell>
            </TableRow>
          )
        })}
      </Table>
    </div>
  )
}
