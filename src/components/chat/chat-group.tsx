"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { type ChatMessage } from "@prisma/client"
import { api } from "~/trpc/react"
import { type Session } from "next-auth"

import { Textarea } from "~/components/ui/textarea"

import { Icons } from "../ui/icons"

interface ChatGroupProps {
  id: string
  name: string
  createdAt: Date
  userId: string
  user: {
    name: string | null
    image: string | null
  }
  chatMessage: {
    message: string
    user: {
      name: string | null
    }
  }[]
}

export default function ChatGroup({
  groups,
  session,
}: {
  groups: ChatGroupProps[] | undefined
  session: Session | null
}) {
  const [id, setId] = useState("")
  const [value, setValue] = useState("")
  const router = useRouter()
  //  const[messages,setMessages]=useState<ChatMessage[] | undefined>(undefined)

  //const [latestMessage,setLatestMessage]=useState<ChatMessage>()
  const [msg, setMsg] = useState<ChatMessage>()

  const allMessages = api.chat.findAllMessage.useQuery({ id }).data
  const sendMessage = api.chat.sendMessage.useMutation()

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
    if (id == "") {
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

  function getMessage(id: string) {
    setId(id)
  }

  const messageRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    messageRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [allMessages, msg])

  return (
    <>
      {groups?.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          No Chat Groups
        </div>
      ) : (
        <div className="flex h-screen justify-start">
          <div className="flex w-72 flex-col justify-start gap-5 border-r-2 border-gray-300 p-5">
            {groups?.map((group) => (
              <div
                onClick={() => getMessage(group.id)}
                className="flex min-h-16 min-w-64 cursor-pointer flex-col  flex-wrap justify-start gap-1 rounded-md bg-clip-border p-4 shadow-sm"
              >
                <div>{group.name}</div>
                {id === "" ? (
                  <div className="flex gap-2 text-sm">
                    <div>{`${
                      group.chatMessage[0]?.user.name?.split(" ")[0] ?? ""
                    }
          ${group.chatMessage[0]?.user.name !== undefined ? ":" : ""}
          `}</div>
                    <div>{group.chatMessage[0]?.message}</div>
                  </div>
                ) : (
                  <div className="flex gap-2 text-sm">
                    {group.id === msg?.chatGroupId ? (
                      <>
                        <div>{`${msg?.createdByName.split(" ")[0]}:`}</div>
                        <div>{msg?.message}</div>
                      </>
                    ) : (
                      <>
                        <div>{`${
                          group.chatMessage[0]?.user.name?.split(" ")[0] ?? ""
                        }
          ${group.chatMessage[0]?.user.name !== undefined ? ":" : ""}
          `}</div>
                        <div>{group.chatMessage[0]?.message}</div>{" "}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="relative flex flex-auto flex-col justify-start">
            <div className="flex items-center justify-around border-b-2 border-gray-200 p-6">
              <div>Avatar</div>
              <div>Team Name</div>
              <div>
                <Icons.threeDots />
              </div>
            </div>

            <div className="flex items-center justify-center">
              {new Date().toLocaleDateString()}
            </div>
            <div className="flex h-screen flex-auto flex-col justify-start gap-5 overflow-y-scroll border-b-2 border-gray-200 p-5">
              {allMessages?.map((message) => (
                <>
                  {message.createdById === session?.user.id ? (
                    <div className="flex justify-end">
                      <div className="flex min-w-40 max-w-80 flex-col flex-wrap rounded-md bg-blue-600 p-1">
                        <div className="ml-3 mt-1 text-white">
                          {message.message}
                        </div>
                        <div className="mr-3 flex justify-end text-sm text-white">
                          {message.createdAt.toString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div>Icon</div>
                      <div className="flex min-w-40 max-w-80 flex-col flex-wrap justify-start rounded-md bg-gray-300">
                        <div className="ml-3 mt-1 text-sm text-black">Name</div>
                        <div className="ml-3 text-sm text-black">
                          {message.message}
                        </div>
                        <div className="mb-1 mr-3 flex justify-end text-black">
                          {message.createdAt.toDateString()}
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
                disabled={id === ""}
                onClick={setMessage}
                id="send-button"
                type="button"
                className="sr-only"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
