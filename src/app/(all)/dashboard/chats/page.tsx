import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

import ChatGroup from "~/components/chat/chat-group"

export default async function Chats() {
  const groups = await db.chatGroup.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      chatMessage: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      },
    },
  })
  const session = await getServerAuthSession()
  return (
    <>
      <ChatGroup session={session} groups={groups} />
    </>
  )
}
