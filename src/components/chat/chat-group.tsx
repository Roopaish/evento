"use client"

import { useEffect, useState } from "react"
import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"
import { type Session } from "next-auth"

import { Textarea } from "@/components/ui/textarea"

import { Icons } from "../ui/icons"
import { ScrollArea } from "../ui/scroll-area"
import ChatHeader from "./chat-header"
import ChatMessages from "./chat-message"

export default function ChatGroup({ session }: { session: Session | null }) {
  const [value, setValue] = useState("")
  const eventId = useCurrentEventStore().currentEvent!
  const { data: currentGroup } = api.chat.findGroupByEventId.useQuery()

  const sendMessage = api.chat.sendMessage.useMutation()
  const { mutate: seenBy } = api.chat.seenBy.useMutation()

  function setMessage() {
    if (value == "") {
      return
    }
    sendMessage.mutate({
      message: value,
      id: currentGroup!.id,
    })
    setValue("")
  }

  useEffect(() => {
    if (currentGroup?.id) seenBy({ id: currentGroup?.id })
  }, [])

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

          <ScrollArea className="flex h-screen flex-auto flex-col justify-start gap-4 border-b-2 border-gray-200 p-5">
            <ChatMessages session={session} chatGroup={currentGroup!} />
          </ScrollArea>

          <div className="flex items-center justify-center gap-3 p-5">
            <Textarea
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMessage()
                }
              }}
              placeholder="Type your message here..."
            />
            <label htmlFor="send-button" className="cursor-pointer">
              <Icons.messageSendIcon />
            </label>
            <input
              // disabled={!id}
              onClick={setMessage}
              id="send-button"
              type="button"
              className="sr-only"
            />
          </div>
        </div>
      </div>
    </>
  )
}
