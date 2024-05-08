import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

import ChatGroup from "./_components/chatGroup"

export default async function Chats() {
  const groups = await db.chatGroup.findMany()
  const session = await getServerAuthSession()
  return (
    <>
      <ChatGroup session={session} groups={groups} />
    </>
  )
}
