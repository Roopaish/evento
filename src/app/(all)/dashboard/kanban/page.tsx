import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { siteConfig } from "@/config/site"
import KanbanBoards from "@/components/kanban/kanban-boards"

export const metadata: Metadata = {
  title: "Kanban | " + siteConfig.name,
  description: siteConfig.description,
}

export default async function KanbanPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }
  return (
    <>
      <KanbanBoards session={session} />
    </>
  )
}
