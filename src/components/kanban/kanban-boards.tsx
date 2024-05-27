"use client"

import { useCurrentEventStore } from "@/store/current-event-store"

import Reminder from "../common/reminder"
import { Text } from "../ui/text"
import Board from "./board"
import KanbanHeader from "./kanban-header"

export default function KanbanBoards() {
  const { currentEvent } = useCurrentEventStore()

  if (!currentEvent) {
    return <Reminder />
  }

  return (
    <>
      <div className="container m-6 flex  flex-col gap-5 px-4">
        <KanbanHeader />
        <Text variant={"h1"} bold className=" text-2xl">
          Team Project Board
        </Text>

        <div className="flex">
          <Board title="To do" tasknumber={6} />
          <Board title="Doing" tasknumber={3} />
          <Board title="Done" tasknumber={2} />
        </div>
      </div>
    </>
  )
}
