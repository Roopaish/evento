"use client"

import { useEffect, useRef, useState } from "react"
import { type ChatMessage } from "@prisma/client"
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
  // const router=useRouter()
  const [id, setId] = useState("")
  const [value, setValue] = useState("")
  // const [random, setRandom] = useState("")
  const [messages, setMessages] = useState<ChatMessage | undefined>(undefined)

  //const [latestMessage,setLatestMessage]=useState<ChatMessage>()
  const allMessages = api.chat.findAllMessage.useQuery({ id }).data
  //const [message, setMessage] = useState<ChatMessage>()
  const sendMessage = api.chat.sendMessage.useMutation()

  api.chat.getLatestMsg.useSubscription(undefined, {
    onData(data) {
      allMessages?.push(data)
      setMessages(data)
      // router.refresh()
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
  }, [allMessages, messages])

  return (
    <div className="flex h-screen justify-start">
      {/* <!-- group section --> */}
      <div className="flex w-72 flex-col justify-start gap-5 border-r-2 border-gray-300 p-5">
        {/* <!-- single chat group --> */}
        {groups?.map((group) => (
          <div
            key={group.id}
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
                <div key={message.id} className="flex justify-end">
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

    // <div className="flex h-screen overflow-hidden">
    //   <div className="w-1/4 border-r border-gray-300 bg-white">
    //     <div className="mb-9 h-screen overflow-y-auto p-3 pb-20">
    //       {groups?.map((group) => (
    //         <div
    //           onClick={() => getMessage(group.id)}
    //           className="mb-4 flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-100"
    //         >
    //           <div className="mr-3 h-12 w-12 rounded-full bg-gray-300">
    //             <img
    //               src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
    //               alt="User Avatar"
    //               className="h-12 w-12 rounded-full"
    //             />
    //           </div>
    //           <div className="flex-1">
    //             <h2 className="text-lg font-semibold">{group.name}</h2>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   <div className="flex-1">
    //     <div className="h-screen overflow-y-scroll p-4 pb-36">
    //       {allMessages?.map((message) => {
    //         return (
    //           <>
    //             {message.createdById === session?.user.id ? (
    //               <div className="mb-4 flex cursor-pointer justify-end">
    //                 <div className="flex max-w-96 gap-3 rounded-lg bg-indigo-500 p-3 text-white">
    //                   <p>{message.message}</p>
    //                   <p>{`${
    //                     message.createdAt.getHours() > 12
    //                       ? message.createdAt.getHours() - 12
    //                       : message.createdAt.getHours()
    //                   }:${message.createdAt.getMinutes()}`}</p>
    //                 </div>
    //                 <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full">
    //                   <img
    //                     src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
    //                     alt="My Avatar"
    //                     className="h-8 w-8 rounded-full"
    //                   />
    //                 </div>
    //               </div>
    //             ) : (
    //               <div className="mb-4 flex cursor-pointer">
    //                 <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-full">
    //                   <img
    //                     src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
    //                     alt="User Avatar"
    //                     className="h-8 w-8 rounded-full"
    //                   />
    //                 </div>
    //                 <div className="flex max-w-96 gap-3 rounded-lg bg-white p-3">
    //                   <p className="text-gray-700">{message.message}</p>
    //                   <p>{`${
    //                     message.createdAt.getHours() > 12
    //                       ? message.createdAt.getHours() - 12
    //                       : message.createdAt.getHours()
    //                   }:${message.createdAt.getMinutes()}`}</p>
    //                 </div>
    //               </div>
    //             )}
    //           </>
    //         )
    //       })}
    //     </div>
    //     <footer className="absolute bottom-0 w-3/4 border-t border-gray-300 bg-white p-4">
    //       <div className="flex items-center">
    //         <input
    //           value={value}
    //           onChange={(e) => {
    //             setValue(e.target?.value)
    //           }}
    //           type="text"
    //           placeholder="Type a message..."
    //           className="w-full rounded-md border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
    //         />
    //         <button
    //           disabled={id === ""}
    //           onClick={setMessage}
    //           className="ml-2 rounded-md bg-indigo-500 px-4 py-2 text-white"
    //         >
    //           Send
    //         </button>
    //       </div>
    //     </footer>
    //   </div>
    // </div>
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
