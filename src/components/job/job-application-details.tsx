import Image from "next/image"
import { api } from "@/trpc/react"
import { toast } from "sonner"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Table, TableCell, TableHead, TableRow } from "../ui/table"

export const JobApplicationDetails = () => {
  const { data } = api.jobs.getApplications.useQuery()
  console.log(data)
  const { mutateAsync, isLoading } = api.jobs.resolveJobApplication.useMutation(
    {
      onError(error) {
        toast.error(error.message)
      },
      onSuccess() {
        toast.success("Approved")
      },
    }
  )

  const onApprove = (id: number) => {
    void mutateAsync({
      status: "ACCEPTED",
      id,
    })
  }
  const onReject = (id: number) => {
    void mutateAsync({
      status: "REJECTED",
      id,
    })
  }

  return (
    <div className="container">
      <Table>
        {/* <TableCaption>Job Applications</TableCaption> */}
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>User Detail</TableHead>
          <TableHead>CV</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Pan</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
        {data?.map(
          ({ message, pan, status, jobPosition, updatedAt, id, user }) => {
            return (
              <TableRow>
                <TableCell>{id}</TableCell>
                <TableCell>{jobPosition.title}</TableCell>
                <TableCell>
                  {/* <Image
                    src={user.image}
                    alt={user.id}
                    height={"20"}
                    width="20"
                  ></Image> */}
                  {/* Image not loading */}
                  {user.name}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>CV Here</TableCell>
                <TableCell>{message}</TableCell>
                <TableCell>{pan}</TableCell>
                <TableCell>
                  {status == "ACCEPTED" ? (
                    <div className="flex justify-center text-2xl text-green-400">
                      Accepted
                    </div>
                  ) : status == "REJECTED" ? (
                    <div className="flex justify-center text-2xl text-red-400">
                      Rejected
                    </div>
                  ) : (
                    <div className="flex justify-center space-x-4">
                      <Button
                        className=""
                        onClick={() => {
                          onApprove(id)
                        }}
                      >
                        Approve{" "}
                      </Button>
                      <Button
                        className="bg-red-500"
                        onClick={() => {
                          onReject(id)
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          }
        )}
      </Table>
    </div>
  )
}
