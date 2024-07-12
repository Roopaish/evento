"use client"

import { api } from "@/trpc/react"
import { TaskStatus } from "@prisma/client"

import Reminder from "../common/reminder"
import Board from "./board"

export default function KanbanBoards() {
  const { data: tasks } = api.kanban.getTasks.useQuery(undefined, {
    refetchInterval: 1000,
  })

  if (!tasks) {
    return <Reminder />
  }
  const { pending, in_progress, completed } = tasks

  const boards = [
    {
      title: "Todo",
      status: TaskStatus.PENDING,
      tasks: pending,
    },
    {
      title: "Doing",
      status: TaskStatus.IN_PROGRESS,
      tasks: in_progress,
    },
    {
      title: "Done",
      status: TaskStatus.COMPLETED,
      tasks: completed,
    },
  ]

  return (
    <>
      <div className="flex max-h-[80vh] gap-6 overflow-x-auto">
        {boards.map((board, index) => (
          <Board
            key={index}
            title={board.title}
            taskNumber={board.tasks.length}
            status={board.status}
            // @ts-expect-error idk
            tasks={board.tasks}
          />
        ))}
      </div>
    </>
  )
}
