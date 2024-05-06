import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

import ChatGroup from "./_components/chatGroup"

export default async function Chats() {
  const group = await db.chatGroup.findMany()
  const session = await getServerAuthSession()
  return (
    <>
      <ChatGroup session={session} group={group} />
    </>
  )
}
