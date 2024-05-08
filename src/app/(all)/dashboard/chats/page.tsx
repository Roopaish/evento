import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

import ChatGroup from "~/components/chat/chat-group"

export default async function Chats() {
  const groups = await db.chatGroup.findMany()
  const session = await getServerAuthSession()
  return (
    <>
      <ChatGroup session={session} groups={groups} />
    </>
  )
}
