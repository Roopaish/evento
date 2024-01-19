import { Header } from "../../components/header"
import Sidebar from "./sidebar"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await getServerAuthSession()

  // if (!session?.user) {
  //   redirect("/login")
  // }

  return (
    <div>
      <Header />
      <div className="mt-[60px] bg-background">
        <div>
          <Sidebar
            className="fixed left-0 hidden max-w-[253px] lg:block"
            data={[
              {
                title: "Overview",
                data: [
                  {
                    icon: "layoutGrid",
                    label: "Dashboard",
                    path: "/dashboard",
                  },
                  { icon: "calendarCheck", label: "Events", path: "/events" },
                  { icon: "users", label: "Staffs", path: "/staffs" },
                  { icon: "messagesSquare", label: "Chats", path: "/chats" },
                ],
              },
              {
                title: "Account",
                data: [{ icon: "user", label: "Profile", path: "/profile" }],
              },
            ]}
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
