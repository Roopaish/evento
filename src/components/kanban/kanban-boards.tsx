"use client"

import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"
import { TaskStatus } from "@prisma/client"

import Reminder from "../common/reminder"
import { Text } from "../ui/text"
import Board from "./board"

export default function KanbanBoards() {
  const { currentEvent } = useCurrentEventStore()

  if (!currentEvent) {
    return <Reminder />
  }

  const { data: tasks } = api.kanban.getTasks.useQuery()
  console.log(tasks)
  if (!tasks) {
    return <Reminder />
  }
  const { pending, in_progress, completed } = tasks

  return (
    <>
      <div className="container m-6 flex flex-col gap-5 px-4">
        <Text variant={"h1"} bold className="text-2xl">
          Team Project Board
        </Text>

        <div className="flex max-h-[80vh] overflow-x-auto">
          <Board
            title="Todo"
            taskNumber={pending.length}
            status={TaskStatus.PENDING}
            tasks={pending}
          />
          <Board
            title="Doing"
            taskNumber={in_progress.length}
            status={TaskStatus.IN_PROGRESS}
            tasks={in_progress}
          />
          <Board
            title="Done"
            taskNumber={completed.length}
            status={TaskStatus.COMPLETED}
            tasks={completed}
          />
        </div>
      </div>
    </>
  )
}
