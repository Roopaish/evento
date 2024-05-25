import "@/styles/globals.css"

import { getServerAuthSession } from "@/server/auth"

import Header from "@/components/layout/header"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()
  return (
    <>
      <Header session={session} />
      <div className="mt-[60px] min-h-screen bg-background">{children}</div>
    </>
  )
}
