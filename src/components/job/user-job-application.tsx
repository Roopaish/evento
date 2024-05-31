"use client"

import { api } from "@/trpc/react"

import { Table, TableCell, TableHead, TableRow } from "../ui/table"

export const AppliedJobTable = () => {
  const { data } = api.jobs.getAppliedApplications.useQuery()
  console.log(data)
  return (
    <div className="container">
      <Table>
        {/* <TableCaption>Job Applications</TableCaption> */}
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied at</TableHead>
        </TableRow>
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
