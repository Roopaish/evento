"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { type ChatGroup, type ChatMessage, type Event } from "@prisma/client"
import { type Session } from "next-auth"

import { Textarea } from "@/components/ui/textarea"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Icons } from "../ui/icons"
import ChatHeader from "./chat-header"
import ChatMessages from "./chat-message"

interface ChatGroupProps extends ChatGroup {
  event: Event
}

export default function ChatGroup({
  chatGroup,
  session,
}: {
  chatGroup: ChatGroupProps | null
  session: Session | null
}) {
  const [value, setValue] = useState("")
  const router = useRouter()
  const [msg, setMsg] = useState<ChatMessage>()

  const allMessages = api.chat.findAllMessage.useQuery({
    id: chatGroup!.id,
  }).data
  const sendMessage = api.chat.sendMessage.useMutation()
  const seenBy = api.chat.seenBy.useMutation()

  api.chat.getLatestMsg.useSubscription(undefined, {
    onData(data) {
      if (chatGroup?.id === data.chatGroupId) {
        allMessages?.push(data)
        seenBy.mutate({ id: chatGroup.id })
        router.refresh()
      }
      setMsg(data)
    },
  })
  function setMessage() {
    if (value == "") {
      return
    }
    sendMessage.mutate({
      message: value,
      id: chatGroup!.id,
    })
    setValue("")
  }

  useEffect(() => {
    seenBy.mutate({ id: chatGroup!.id })
  }, [])

  return (
    <>
      <div className="flex h-[690px] justify-start">
        <div className="relative flex flex-auto flex-col justify-start">
          <ChatHeader />

          <div className="mt-2 flex items-center justify-center text-sm">
            {new Date().toLocaleDateString()}
          </div>

          <div className="flex h-screen flex-auto flex-col justify-start gap-5 overflow-y-scroll border-b-2 border-gray-200 p-5">
            <ChatMessages session={session} messages={allMessages} msg={msg} />
          </div>

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
              <Icons.send />
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
