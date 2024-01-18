import "~/styles/globals.css"

import { redirect } from "next/navigation"
import { getServerAuthSession } from "~/server/auth"

import { Menu } from "./components/menu"
import Sidebar from "./components/sidebar"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="hidden md:block">
      <Menu />
      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar
              className="hidden lg:block"
              data={[
                { icon: "google", label: "Dashaboard", path: "/dashboard" },
                { icon: "paypal", label: "Events", path: "/events" },
              ]}
            />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
