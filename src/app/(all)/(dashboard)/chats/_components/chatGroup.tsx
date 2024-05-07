"use client"

import { useEffect, useRef, useState } from "react"
import { api } from "~/trpc/react"
import { type Session } from "next-auth"

import { Textarea } from "~/components/ui/textarea"

interface ChatGroupProps {
  id: string
  name: string
  createdAt: Date
  userId: string
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
  const [random, setRandom] = useState("")
  //  const[messages,setMessages]=useState<ChatMessage[] | undefined>(undefined)

  //const [latestMessage,setLatestMessage]=useState<ChatMessage>()
  const allMessages = api.chat.findAllMessage.useQuery({ id }).data
  //const [message, setMessage] = useState<ChatMessage>()
  const sendMessage = api.chat.sendMessage.useMutation()

  api.chat.getLatestMsg.useSubscription(undefined, {
    onData(data) {
      allMessages?.push(data)
      setRandom("done")
    },
    onError(err) {
      console.log({ err })
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
    messageRef.current?.scrollIntoView()
  }, [allMessages])

  return (
    <div className="flex h-screen justify-start">
      {/* <!-- group section --> */}
      <div className="flex w-72 flex-col justify-start gap-5 border-r-2 border-gray-300 p-5">
        {/* <!-- single chat group --> */}
        {groups?.map((group) => (
          <div
            onClick={() => getMessage(group.id)}
            className="flex min-h-16 min-w-64 cursor-pointer flex-col flex-wrap justify-start rounded-md bg-clip-border p-4 shadow-sm"
          >
            <div>{group.name}</div>
            <div className="text-sm"></div>
          </div>
        ))}
      </div>
      {/* <!-- group section ended --> */}

      {/* <!-- chat section started --> */}
      <div className="relative flex flex-auto flex-col justify-start">
        {/* <!-- top nav --> */}
        <div className="flex items-center justify-around border-b-2 border-gray-200 p-6">
          <div>Avatar</div>
          <div>Team Name</div>
          <div>...</div>
        </div>

        {/* <!-- chat body --> */}
        <div className="flex items-center justify-center">date</div>
        <div className="flex h-screen flex-auto flex-col justify-start gap-5 overflow-y-scroll border-b-2 border-gray-200 p-5">
          {allMessages?.map((message) => (
            <>
              {message.createdById === session?.user.id ? (
                // {/* <!-- outgoing msg --> */}
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
            </>
          ))}

          <div ref={messageRef}></div>

          {/* <!-- incoming msg --> */}
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
            <SendButton />
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
  )
}

function SendButton() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="blue"
      className="h-8 w-8"
    >
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  )
}
