"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { type ChatMessage } from "@prisma/client"
import { type Session } from "next-auth"

import { Textarea } from "@/components/ui/textarea"

import { Icons } from "../ui/icons"
import GroupList from "./group-list"

interface ChatMessageProps extends ChatMessage {
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export default function ChatGroup({ session }: { session: Session | null }) {
  const [id, setId] = useState<number>(1)
  const [name, setName] = useState("")

  const [value, setValue] = useState("")
  const router = useRouter()
  //  const[messages,setMessages]=useState<ChatMessage[] | undefined>(undefined)

  //const [latestMessage,setLatestMessage]=useState<ChatMessage>()
  const [msg, setMsg] = useState<ChatMessageProps>()

  const groups = api.chat.allGroups.useQuery().data

  const allMessages = api.chat.findAllMessage.useQuery({
    id,
  }).data
  const sendMessage = api.chat.sendMessage.useMutation()
  const seenBy = api.chat.seenBy.useMutation()

  api.chat.getLatestMsg.useSubscription(undefined, {
    onData(data) {
      if (id === data.chatGroupId) {
        allMessages?.push(data)
        router.refresh()
      }
      setMsg(data)
    },
  })
  function setMessage() {
    if (!id) {
      return
    }

    if (value == "") {
      return
    }

    sendMessage.mutate({
      message: value,
      id,
    })
    setValue("")
  }

  function getMessage(id: number, name: string) {
    setId(id)
    seenBy.mutate({ id })
    setName(name)
  }

  const messageRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    messageRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [allMessages, msg])

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

  return (
    <>
      {groups?.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          No Chat Groups
        </div>
      ) : (
        <div className="flex h-screen justify-start">
          <div className="flex w-80 flex-col justify-start gap-3 overflow-x-hidden overflow-y-scroll border-r-2 border-gray-300 p-5">
            {groups?.map((group) => (
              <GroupList group={group} getMessage={getMessage} />
            ))}
          </div>

          {!id ? (
            ""
          ) : (
            <div className="relative flex flex-auto flex-col justify-start">
              <div className="flex items-center justify-between border-b-2 border-gray-200 p-4">
                <div> Avatars</div>
                <div>{name}</div>
                <div>
                  <Icons.threeDots />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-center text-sm">
                {new Date().toLocaleDateString()}
              </div>
              <div className="flex h-screen flex-auto flex-col justify-start gap-5 overflow-y-scroll border-b-2 border-gray-200 p-5">
                {allMessages?.map((message) => (
                  <>
                    {message.user.id === session?.user.id ? (
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
                        <img
                          className="h-8 w-8 rounded-full"
                          src={message.user.image!}
                          alt="user image"
                        />
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
                  disabled={!id}
                  onClick={setMessage}
                  id="send-button"
                  type="button"
                  className="sr-only"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
