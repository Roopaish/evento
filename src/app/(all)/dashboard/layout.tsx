import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { userSideNavItems } from "@/config/nav"

import Sidebar from "../../../components/layout/sidebar"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (!session?.user) {
    redirect("/login?msg=unauthorized")
  }

  return (
    <div>
      <div className="mt-[60px] bg-background">
        <div>
          <Sidebar
            className="fixed left-0 hidden max-w-[253px] lg:block"
            data={userSideNavItems}
          />
          <div className="lg:ml-[253px] lg:border-l">
            <div
              className="h-full px-4 py-6 lg:px-8"
              style={{
                minHeight: "calc(100vh - 60px)",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
