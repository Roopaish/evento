"use client"

import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"
import { TaskStatus } from "@prisma/client"
import type { Session } from "next-auth"

import Reminder from "../common/reminder"
import { Text } from "../ui/text"
import Board from "./board"
import KanbanHeader from "./kanban-header"

export default function KanbanBoards({ session }: { session: Session | null }) {
  const { currentEvent } = useCurrentEventStore()

  if (!currentEvent) {
    return <Reminder />
  }

  const { data: tasks, status: fetchStatus } = api.kanban.getTasks.useQuery()
  console.log(tasks)
  if (!tasks) {
    return <Reminder />
  }
  const { pending, in_progress, completed } = tasks

  return (
    <>
      <div className="container m-6 flex flex-col gap-5 px-4">
        <KanbanHeader />
        <Text variant={"h1"} bold className="text-2xl">
          Team Project Board
        </Text>

        <div className="flex max-h-[80vh] overflow-x-auto">
          <Board
            title="Todo"
            taskNumber={pending.length}
            status={TaskStatus.PENDING}
          />
          <Board
            title="Doing"
            taskNumber={in_progress.length}
            status={TaskStatus.IN_PROGRESS}
          />
          <Board
            title="Done"
            taskNumber={completed.length}
            status={TaskStatus.COMPLETED}
          />
        </div>
      </div>
    </>
  )
}
