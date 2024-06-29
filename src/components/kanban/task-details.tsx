import { useState } from "react"
import { api } from "@/trpc/react"
import type { Task } from "@/types"
import { toast } from "sonner"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import { Text } from "../ui/text"
import TaskForm from "./task-form"

export default function TaskDetails({ task }: { task: Task }) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const utils = api.useUtils()

  const deleteTask = api.kanban.deleteTask.useMutation({
    onSuccess: () => {
      toast.success("Task has been deleted.")
      void utils.kanban.getTasks.refetch() // <= here
    },
    onError: (e) => {
      toast.error("Failed to delete task.", {
        description: e.message,
      })
    },
  })

  const handleDeleteTask = () => {
    deleteTask.mutate({ id: task.id })
  }
  return (
    <>
      <div className="flex flex-col gap-4" onClick={() => setIsEditOpen(true)}>
        <Text
          variant={"small"}
          semibold
          className=" flex h-6  max-w-max items-center rounded-full bg-pink-100 px-3  text-pink-500"
        >
          {task.status}
        </Text>
        <div className="flex items-center justify-between">
          <Text variant={"medium"} semibold>
            {task.title}
          </Text>

          <Popover>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                className="right-0 top-0 mr-4 mt-3 flex  h-5 w-5 items-center justify-center"
              >
                <Icons.MoreVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="max-w-40 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex space-x-2">
                <div className="flex h-full flex-col gap-4 overflow-y-auto">
                  <Dialog
                    open={isEditOpen}
                    onOpenChange={(open) => setIsEditOpen(open)}
                  >
                    <DialogTrigger asChild>
                      <Button variant={"ghost"}>
                        <Icons.Pencil className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription>
                          Edit Task here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <TaskForm
                        status={task.status}
                        onCancel={() => setIsEditOpen(false)}
                        task={task}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <Button variant={"ghost"} onClick={() => handleDeleteTask()}>
                  <Icons.Trash className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Text variant={"medium"}>{task.description}</Text>
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <Icons.CalendarDays className="h-4 w-4 fill-current text-gray-300" />
          <span className="ml-1">{task.dueDate?.toDateString()}</span>
        </div>
        {task.assignedTo?.map((user) => (
          <div className="flex items-center gap-2">
            <Avatar className="mr-2 h-6 w-6 rounded-full">
              <AvatarImage src={user.image ?? ""} className="object-cover" />
              <AvatarFallback>{user.name?.toString()}</AvatarFallback>
            </Avatar>
            <Text variant={"small"} className="">
              {user.name?.toString()}
            </Text>
          </div>
        ))}
      </div>
    </>
  )
}
