import { type ReactNode } from "react"
import { getServerAuthSession } from "~/server/auth"

import Navbar from "./nav-bar"

export default async function MainLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerAuthSession()

  return (
    <>
      <Navbar session={session} />
      {children}
    </>
  )
}
