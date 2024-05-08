import "~/styles/globals.css"

import { getServerAuthSession } from "~/server/auth"

import Footer from "~/components/layout/footer"
import { MainNav } from "~/components/layout/main-nav"
import { UserNav } from "~/components/layout/user-nav"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-background">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav session={session} />
            </div>
          </div>
        </div>
      </header>
      <div className="mt-[60px] bg-background pb-10">{children}</div>
      <Footer />
    </>
  )
}
