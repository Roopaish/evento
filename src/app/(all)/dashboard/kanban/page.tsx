import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import KanbanBoards from "@/components/kanban/kanban-boards"

export const metadata: Metadata = {
  title: "Kanban | " + siteConfig.name,
  description: siteConfig.description,
}

export default async function KanbanPage() {
  return (
    <>
      <KanbanBoards />
    </>
  )
}
