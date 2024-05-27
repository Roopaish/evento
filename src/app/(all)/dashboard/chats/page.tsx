import { getServerAuthSession } from "@/server/auth"
import { api } from "@/trpc/server"

import ChatGroup from "@/components/chat/chat-group"

export default async function Chats() {
  const session = await getServerAuthSession()
  const group = await api.chat.findGroupById.query({ id: 1 })
  return (
    <>
      <ChatGroup session={session} chatGroup={group} />
    </>
  )
}
