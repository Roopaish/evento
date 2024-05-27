import "@/styles/globals.css"

import { cookies } from "next/headers"
import { getServerAuthSession } from "@/server/auth"

import Header from "@/components/layout/header"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()
  const currentEvent = cookies().get("event")?.value

  return (
    <>
      <Header
        session={session}
        currentEvent={currentEvent ? Number(currentEvent) : undefined}
      />
      <div className="mt-[60px] bg-background">{children}</div>
    </>
  )
}
