"use client"

import { useCurrentEventStore } from "@/store/current-event-store"

import Reminder from "../common/reminder"
import Board from "./board"

export default function KanbanBoards() {
  const { currentEvent } = useCurrentEventStore()

  if (!currentEvent) {
    return <Reminder />
  }

  return (
    <div className="flex">
      <Board title="To do" />
      <Board title="Doing" />
      <Board title="Done" />
    </div>
  )
}
