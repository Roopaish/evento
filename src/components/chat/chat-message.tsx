import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import {
  type ChatGroup,
  type ChatMessage,
  type Event,
  type User,
} from "@prisma/client"
import { type Session } from "next-auth"

import { getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Icons } from "../ui/icons"

interface ChatMessageProps extends ChatMessage {
  user: User
}

interface ChatGroupProps extends ChatGroup {
  event: Event
}

export default function ChatMessages({
  session,
  chatGroup,
}: {
  session: Session | null
  chatGroup: ChatGroupProps
}) {
  console.log(chatGroup)

  const [msg, setMsg] = useState<ChatMessageProps>()
  const router = useRouter()

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

  // useEffect(()=>{
  //    setMsg(chatMessages)
  // },[])

  const { data: messages, isLoading: messageLoading } =
    api.chat.findAllMessage.useQuery(
      { id: chatGroup?.id },
      {
        enabled: !!chatGroup?.id,
        // trpc: {
        //   context: {
        //     skipBatch: true,
        //   },
        // }
      }
    )

  const seenBy = api.chat.seenBy.useMutation()

  api.chat.getLatestMsg.useSubscription(undefined, {
    onData(data) {
      if (chatGroup?.id === data.chatGroupId) {
        // setMsg((prevState) => Array.isArray(prevState) ? [...prevState, data] : [data]);
        messages?.push(data)

        seenBy.mutate({ id: chatGroup.id })
        router.refresh()
      }
      setMsg(data)
    },
  })

  const messageRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    messageRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [messages, msg])

  if (messageLoading) {
    return <Icons.spinner className="h-4 w-4 animate-spin" />
  }

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
