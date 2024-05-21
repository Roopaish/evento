import { getServerAuthSession } from "~/server/auth"

import Home from "~/components/kanban/home"

export default async function Kanban() {
  const session = await getServerAuthSession()
  return (
    <>
      <Home session={session} />
    </>
  )
  // return <div>Kanban</div>
}
