import { getServerAuthSession } from "~/server/auth"

import ChatGroup from "~/components/chat/chat-group"

export default async function Chats() {
  const session = await getServerAuthSession()
  return (
    <>
      <ChatGroup session={session} />
    </>
  )
}
