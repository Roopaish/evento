"use client"

import { useEffect, useState } from "react"
import AppStateProvider from "~/state/kanban/app-state"
import type { Session } from "next-auth"

import App from "~/components/kanban/app"
import Sidebar from "~/components/kanban/sidebar"

export default function Home({ session }: { session: Session | null }) {
  const [isLight, setIsLight] = useState<boolean>(true)
  const [showSideBar, setShowSidebar] = useState(false)
  useEffect(() => {
    setIsLight(() => {
      const isLight = localStorage.getItem("theme")
      if (isLight) return Boolean(JSON.parse(isLight))
      localStorage.setItem("theme", "true")

      return true
    })
  }, [])

  return (
    <>
      <div className={`${isLight ? "" : "dark"} `}>
        <div id="modal"></div>
        <AppStateProvider session={session}>
          <div className={`flex h-screen overflow-hidden`}>
            {showSideBar && (
              <Sidebar
                setShowSidebar={setShowSidebar}
                isLight={isLight}
                setIsLight={setIsLight}
              />
            )}
            <App showSideBar={showSideBar} setShowSidebar={setShowSidebar} />
          </div>
        </AppStateProvider>
      </div>
    </>
  )
}
