import { useState } from "react"
import type { Task } from "@/types"
import type { TaskStatus } from "@prisma/client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import { Text } from "../ui/text"
import TaskCard from "./task-card"
import TaskForm from "./task-form"

export default function Board({
  title,
  taskNumber,
  status,
  tasks,
}: {
  title: string
  taskNumber?: number
  status: TaskStatus
  tasks: Task[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="max-h-[80vh] min-w-96">
        <div className="flex h-full flex-col gap-4 overflow-y-auto">
          <div className="mt-4 flex space-x-6 px-10">
            <div className="flex w-full items-center">
              <div className="flex h-10 items-center px-2">
                <Text variant="small" semibold>
                  {title}
                </Text>
                <div className="bg-primary- ml-2 h-5 w-5 items-center justify-center rounded text-primary-500">
                  <Text variant="small" semibold>
                    ({taskNumber})
                  </Text>
                </div>
              </div>
            </div>

            <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto flex h-6 w-6 items-center justify-center rounded"
                >
                  <Icons.Plus className="text-primary-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription>
                    Add New Tasks here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <TaskForm status={status} onCancel={() => setIsOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div>
            {tasks.map((task, index) => (
              <TaskCard task={task} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
