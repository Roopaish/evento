"use client"

import { useState } from "react"
import { type ChatMessage } from "@prisma/client"
import { api } from "~/trpc/react"
import { type Session } from "next-auth"

interface ChatGroupProps {
  id: string
  name: string
  createdAt: Date
  userId: string
}

export default function ChatGroup({
  group,
  session,
}: {
  group: ChatGroupProps[] | undefined
  session: Session | null
}) {
  const [id, setId] = useState("")
  const [value, setValue] = useState("")
  const [random, setRandom] = useState("")
  //  const[messages,setMessages]=useState<ChatMessage[] | undefined>(undefined)

  //const [latestMessage,setLatestMessage]=useState<ChatMessage>()
  const allMessages = api.chat.findAllMessage.useQuery({ id }).data
  //const [message, setMessage] = useState<ChatMessage>()
  const saveMessage = api.chat.sendMessage.useMutation()

  api.chat.getLatestMsg.useSubscription(undefined, {
    onData(data) {
      allMessages?.push(data)
      setRandom("done")
    },
    onError(err) {
      console.log({ err })
    },
  })

  function sendMessage() {
    if (id == "") {
      return
    }

    if (value == "") {
      return
    }

    saveMessage.mutate({
      message: value,
      id,
    })
  }

  function getMessage(id: string) {
    setId(id)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 border-r border-gray-300 bg-white">
        <div className="mb-9 h-screen overflow-y-auto p-3 pb-20">
          {group?.map((group) => (
            <div
              onClick={() => getMessage(group.id)}
              className="mb-4 flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-100"
            >
              <div className="mr-3 h-12 w-12 rounded-full bg-gray-300">
                <img
                  src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="User Avatar"
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{group.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="h-screen overflow-y-scroll p-4 pb-36">
          {allMessages?.map((message) => {
            return (
              <>
                {message.createdById === session?.user.id ? (
                  <div className="mb-4 flex cursor-pointer justify-end">
                    <div className="flex max-w-96 gap-3 rounded-lg bg-indigo-500 p-3 text-white">
                      <p>{message.message}</p>
                      <p>{`${
                        message.createdAt.getHours() > 12
                          ? message.createdAt.getHours() - 12
                          : message.createdAt.getHours()
                      }:${message.createdAt.getMinutes()}`}</p>
                    </div>
                    <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full">
                      <img
                        src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                        alt="My Avatar"
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex cursor-pointer">
                    <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-full">
                      <img
                        src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                        alt="User Avatar"
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                    <div className="flex max-w-96 gap-3 rounded-lg bg-white p-3">
                      <p className="text-gray-700">{message.message}</p>
                      <p>{`${
                        message.createdAt.getHours() > 12
                          ? message.createdAt.getHours() - 12
                          : message.createdAt.getHours()
                      }:${message.createdAt.getMinutes()}`}</p>
                    </div>
                  </div>
                )}
              </>
            )
          })}
        </div>
        <footer className="absolute bottom-0 w-3/4 border-t border-gray-300 bg-white p-4">
          <div className="flex items-center">
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target?.value)
              }}
              type="text"
              placeholder="Type a message..."
              className="w-full rounded-md border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              disabled={id === ""}
              onClick={sendMessage}
              className="ml-2 rounded-md bg-indigo-500 px-4 py-2 text-white"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
