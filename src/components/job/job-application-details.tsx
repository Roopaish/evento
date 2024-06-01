import { api } from "@/trpc/react"
import { toast } from "sonner"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog"
import { Table, TableCell, TableHead, TableRow } from "../ui/table"
import { Text } from "../ui/text"

export const JobApplicationDetails = () => {
  const { data, refetch } = api.jobs.getApplications.useQuery()
  console.log(data)

  const { mutateAsync, isLoading } = api.jobs.resolveJobApplication.useMutation(
    {
      onError(error) {
        toast.error(error.message)
      },
      onSuccess() {
        toast.success("Approved")
        refetch()
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
    <div>
      <Text variant={"h6"} className="mb-4 mt-10" medium>
        Job Applications
      </Text>
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
          ({ message, pan, status, jobPosition, updatedAt, id, user, cv }) => {
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
                <TableCell>
                  <Dialog>
                    <DialogTrigger>
                      <img
                        src={cv?.url}
                        alt={cv?.name}
                        className="h-full w-full max-w-60 object-contain"
                      ></img>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-[800px]">
                      <DialogDescription>
                        <img src={cv?.url} alt={cv?.name}></img>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </TableCell>
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
