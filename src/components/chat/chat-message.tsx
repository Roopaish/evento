import { useCallback, useEffect, useRef, useState } from "react"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"
import { type ChatGroup, type Event } from "@prisma/client"
import { format } from "date-fns"
import { type Session } from "next-auth"

import { getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Icons } from "../ui/icons"
import { ScrollArea } from "../ui/scroll-area"
import { Textarea } from "../ui/textarea"

interface ChatGroupProps extends ChatGroup {
  event: Event
}

export default function ChatMessages({
  session,
  chatGroup,
  initialData,
}: {
  session: Session | null
  chatGroup: ChatGroupProps
  initialData?: RouterOutputs["chat"]["getUserMessage"]
}) {
  const [value, setValue] = useState("")
  const [isHovering, setIsHovered] = useState(false)
  const [id, setId] = useState<number>()

  const onMouseEnter = (id: number) => {
    setIsHovered(true)
    setId(id)
  }

  const onMouseLeave = () => setIsHovered(false)

  const seenBy = api.chat.seenBy.useMutation()

  const sendMessage = api.chat.sendMessage.useMutation()

  function setMessage() {
    if (value.trim() === "") {
      setValue("")
      return
    }
    sendMessage.mutate(
      {
        message: value,
        id: chatGroup.id,
      },
      {
        onSuccess: () => {
          scrollToBottomOfList()
        },
      }
    )
    setValue("")
  }

  const {
    data: messageData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.chat.getUserMessage.useInfiniteQuery(
    {
      // id: chatGroup?.id,
    },
    {
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [""],
          }
        : undefined,
      getNextPageParam: (d) => d.nextCursor,
    }
  )

  const [messages, setMessages] = useState(() => {
    const msgs = messageData?.pages.map((page) => page.items).flat()
    return msgs
  })

  type Message = NonNullable<typeof messages>[number]

  const scrollTargetRef = useRef<HTMLDivElement>(null)

  const addMessages = useCallback((incoming?: Message[]) => {
    setMessages((current) => {
      const map: Record<Message["id"], Message> = {}
      for (const msg of current ?? []) {
        map[msg.id] = msg
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )
    })
  }, [])

  useEffect(() => {
    const msgs = messageData?.pages.map((page) => page.items).flat()
    addMessages(msgs)
  }, [messageData?.pages, addMessages])

  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current == null) {
      return
    }
    scrollTargetRef.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "auto",
    })

    // scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'end',
    // });
  }, [scrollTargetRef])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottomOfList()
    }, 400)
    seenBy.mutate()
    return () => clearTimeout(timeoutId)
  }, [])

  function timeFormatter(date: Date) {
    return format(date, "hh:mm aa")
  }

  function dateFormatter(date: Date) {
    return format(date, "do MMMM")
  }

  const utils = api.useUtils()

  api.chat.getLatestMsg.useSubscription(undefined, {
    onData(data) {
      if (chatGroup?.id === data.chatGroupId) {
        void utils.chat.getUserMessage.refetch()
        addMessages([data])
      }
      const timeoutId = setTimeout(() => {
        scrollToBottomOfList()
      }, 400)
      return () => clearTimeout(timeoutId)
      seenBy.mutate()
    },
    onError(err) {
      console.error("Subscription error:", err)
      void utils.chat.getUserMessage.invalidate()
    },
  })

  return (
    <>
      <ScrollArea className="flex h-screen flex-auto flex-col justify-start gap-5 border-b-2 border-gray-200 p-5">
        <div className="flex w-full items-center justify-center">
          <button
            data-testid="loadMore"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className={`m-4 rounded bg-[rgb(22,163,74)] px-4 py-2 text-white disabled:opacity-40
           ${messages?.length != 0 ? "" : "hidden"}`}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
          </button>
        </div>

        <div className="space-y-4">
          {messages?.map((message) => (
            <>
              {message.userId === session?.user.id ? (
                <div
                  key={message.id}
                  className="flex items-start justify-end gap-2"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <div
                        className={`flex flex-1 items-center justify-end gap-1 text-[12px] font-normal text-gray-500 dark:text-gray-400 ${
                          isHovering && message.id == id ? "" : "hidden"
                        }`}
                      >
                        <div>{timeFormatter(message.createdAt)},</div>
                        <div>{dateFormatter(message.createdAt)}</div>
                      </div>

                      <div
                        onMouseEnter={() => {
                          onMouseEnter(message.id)
                        }}
                        onMouseLeave={onMouseLeave}
                        className="leading-1.5  flex max-w-60 cursor-pointer rounded-e-xl rounded-es-xl border-[rgb(22,163,74)] bg-[rgb(22,163,74)] p-4"
                      >
                        <p className="text-sm font-normal text-slate-100 dark:text-white">
                          {" "}
                          {message.message}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex flex-wrap items-end justify-end gap-1 text-[12px] font-normal text-gray-500 dark:text-gray-400 ${
                        isHovering && message.id == id ? "" : "hidden"
                      }`}
                    >
                      <div>
                        {message?.seenBy?.length != 0 ? "seen by" : " "}
                      </div>

                      <span className={` flex `}>
                        {message?.seenBy?.map((user, index) => (
                          <div key={user.id}>
                            {user?.name?.split(" ")[0] ??
                              user.email?.split("@")[0]}
                            {index < message.seenBy.length - 1 ? ", " : " "}
                          </div>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className="box-border flex flex-wrap items-start gap-3"
                >
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={message.user.image!} alt="user image" />
                    <AvatarFallback>
                      {getInitials(message.user.name ?? message.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-wrap gap-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-[12px] font-semibold text-gray-900 dark:text-white">
                        {message.user.name ?? message.user.email?.split("@")[0]}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <div
                        onMouseEnter={() => {
                          onMouseEnter(message.id)
                        }}
                        onMouseLeave={onMouseLeave}
                        className="leading-1.5 rounded-es-x flex max-w-60 cursor-pointer  rounded-e-xl border-gray-200 bg-gray-100 p-4"
                      >
                        <p className="text-sm font-normal text-gray-900 dark:text-white">
                          {" "}
                          {message.message}
                        </p>
                      </div>
                      <div
                        className={`flex content-end  items-center gap-1 text-[12px] font-normal text-gray-500 dark:text-gray-400 ${
                          isHovering && message.id == id ? "" : "hidden"
                        }`}
                      >
                        <div> {timeFormatter(message.createdAt)},</div>

                        <div> {dateFormatter(message.createdAt)}</div>
                      </div>
                    </div>

                    <div
                      className={`flex max-w-60 flex-wrap gap-1 text-[12px] font-normal text-gray-500 dark:text-gray-400 ${
                        isHovering && message.id == id ? "" : "hidden"
                      }`}
                    >
                      <div>
                        {message?.seenBy?.length === 0 ? "" : "seen by"}
                      </div>
                      <span className={` flex `}>
                        {message?.seenBy?.map((user, index) => (
                          <div key={user.id}>
                            {user?.name?.split(" ")[0] ??
                              user.email?.split("@")[0]}
                            {index < message.seenBy.length - 1 ? ", " : " "}
                          </div>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
        <div ref={scrollTargetRef}></div>
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
    </>
  )
}
