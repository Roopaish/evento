import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import { Text } from "../ui/text"

const TaskCard = ({
  title,
  taskDetails,
  date,
  assignedTo,
}: {
  title: string
  taskDetails: string
  date: string
  assignedTo?: string
}) => {
  return (
    <div
      className="group relative m-3 flex cursor-pointer flex-col items-start rounded-lg bg-gray-100  p-4 hover:bg-opacity-100"
      draggable="true"
    >
      <Text
        variant={"small"}
        semibold
        className="flex h-6 items-center rounded-full bg-pink-100 px-3  text-pink-500"
      >
        {title}
      </Text>

      <Text variant={"medium"} className="mt-3 text-sm">
        {taskDetails}
      </Text>

      <div className="mt-3 flex w-full items-center text-xs font-medium text-gray-400">
        <div className="flex items-center">
          <Icons.CalendarDays className="h-4 w-4 fill-current text-gray-300" />
          <div className="ml-1 leading-none">{date}</div>
        </div>

        <Text variant={"small"} className="mt-3 text-sm font-medium">
          {assignedTo}
        </Text>

        <Avatar className="ml-10 h-6 w-6 rounded-full">
          <AvatarImage
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            className="object-cover"
          />
          <AvatarFallback>ABK</AvatarFallback>
        </Avatar>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 mr-4 mt-3  h-5 w-5 items-center justify-center"
          >
            <Icons.MoreVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-40 p-0">
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
  )
}

export default TaskCard
