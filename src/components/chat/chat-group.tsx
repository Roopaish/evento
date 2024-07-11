"use client"

import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"
import { type Session } from "next-auth"

import ChatHeader from "./chat-header"
import ChatMessages from "./chat-message"

export default function ChatGroup({ session }: { session: Session | null }) {
  const eventId = useCurrentEventStore().currentEvent!
  const { data: currentGroup } = api.chat.findGroupByEventId.useQuery()

  if (!eventId) {
    return <div>No event chosen</div>
  }

  return (
    <>
      <div className="flex h-[80vh] justify-start rounded-sm border">
        <div className="relative flex flex-auto flex-col justify-start">
          <ChatHeader chatGroup={currentGroup!} />

          <div className="mt-2 flex items-center justify-center text-sm">
            {new Date().toLocaleDateString()}
          </div>

          <ChatMessages session={session} chatGroup={currentGroup!} />
        </div>
      </div>
    </>
  )
}
