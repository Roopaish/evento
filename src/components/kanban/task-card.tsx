import { useState } from "react"
import type { Session } from "next-auth"

import { getInitials } from "@/lib/utils"
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
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import { Text } from "../ui/text"
import TaskDetails from "./task-details"

const TaskCard = ({
  session,
  category,
  title,
  description,
  date,
  assignedTo,
}: {
  session: Session
  category: string
  title: string
  description: string | null
  date: Date | null
  assignedTo?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className="group relative m-3 flex cursor-pointer flex-col items-start rounded-lg bg-gray-100  p-4 hover:bg-opacity-100"
        draggable="true"
        onClick={() => setIsOpen(true)}
      >
        <Text
          variant={"small"}
          semibold
          className="flex h-6 items-center rounded-full bg-pink-100 px-3  text-pink-500"
        >
          {category}
        </Text>
        <Text variant={"medium"} className="mt-3 text-sm">
          {title}
        </Text>

        <div className="mt-3 flex w-full items-center justify-between text-xs font-medium text-gray-400">
          <div className="flex items-center">
            <Icons.CalendarDays className="h-4 w-4 fill-current text-gray-300" />
            <div className="ml-1 leading-none">{date?.toDateString()}</div>
          </div>

          <Avatar className="ml-10 h-6 w-6 rounded-full">
            <AvatarImage
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? "avatar"}
            />
            <AvatarFallback className="bg-primary text-white">
              {session?.user?.name ? (
                getInitials(session?.user?.name)
              ) : (
                <Icons.User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>

        <Popover>
          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 mr-4 mt-3  h-5 w-5 items-center justify-center"
            >
              <Icons.MoreVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="max-w-40 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="divide-y-2">
              <Button
                variant={"ghost"}
                className="w-full justify-start rounded-none"
              >
                <Icons.Pencil />
                Edit Task
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start rounded-none"
              >
                <Icons.Trash />
                Delete Task
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <TaskDetails
            category={category}
            title={title}
            description={description}
            dueDate={date?.toDateString() ?? ""}
            assignedTo={assignedTo}
            avatarUrl={
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            }
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TaskCard
