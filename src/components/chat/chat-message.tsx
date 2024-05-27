import { useEffect, useRef } from "react"
import { type ChatMessage, type User } from "@prisma/client"
import { type Session } from "next-auth"

import { getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface ChatMessagesProps extends ChatMessage {
  user: User
}

export default function ChatMessages({
  session,
  messages,
  msg,
}: {
  session: Session | null
  messages: ChatMessagesProps[] | undefined
  msg: ChatMessage | undefined
}) {
  function timeFormatter(date: Date) {
    const time = date.toLocaleTimeString()
    const displayTime = time.slice(0, 4) + time.slice(7, 10)
    return displayTime
  }

  function dateFormatter(date: Date) {
    const d = date.toLocaleDateString()
    const displayDate = d.slice(0, 4)
    return displayDate
  }

  const messageRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    messageRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [messages, msg])

  return (
    <>
      {messages?.map((message) => (
        <>
          {message.userId === session?.user.id ? (
            <div className="flex flex-wrap items-start justify-end gap-2">
              <div className="flex max-w-60 flex-col flex-wrap gap-1">
                <div className="flex items-center justify-end">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {timeFormatter(message.createdAt)}
                  </span>
                </div>

                <div className="leading-1.5 flex rounded-e-xl rounded-es-xl border-blue-200 bg-blue-100 p-4">
                  <p className="text-sm font-normal text-gray-900 dark:text-white">
                    {" "}
                    {message.message}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {dateFormatter(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-start gap-2">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={message.user.image!} alt="user image" />
                <AvatarFallback>
                  {getInitials(message.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex max-w-60 flex-col flex-wrap gap-1">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {message.user.name}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {timeFormatter(message.createdAt)}
                  </span>
                </div>
                <div className="leading-1.5 rounded-es-x flex rounded-e-xl border-gray-200 bg-gray-100 p-4">
                  <p className="text-sm font-normal text-gray-900 dark:text-white">
                    {" "}
                    {message.message}
                  </p>
                </div>
                <div className="flex items-center justify-start">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {dateFormatter(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messageRef}></div>
        </>
      ))}
    </>
  )
}
