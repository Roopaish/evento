import "@/styles/globals.css"

import { getServerAuthSession } from "@/server/auth"

import Footer from "@/components/layout/footer"
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
      <div className="mt-[60px] bg-background pb-10">{children}</div>
      <Footer />
    </>
  )
}
