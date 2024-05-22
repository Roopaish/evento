"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Session } from "next-auth"

import { mainNavItems } from "@/config/nav"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"

import { Button } from "../ui/button"
import SearchBar from "./search-bar"
import UserNav from "./user-nav"

export default function Header({ session }: { session: Session | null }) {
  const pathname = usePathname()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-background">
      <div className="border-b py-3">
        <div className="flex items-center px-4">
          <nav className="flex flex-1 items-center  space-x-4 lg:space-x-6">
            <Link href={"/"} className="mr-4">
              <Icons.logo mode="light"></Icons.logo>
            </Link>
            <SearchBar />

            {/* TODO: On dashboard, show a event switch button to switch between events */}

            {/* TODO: Search Bar, Got to /search?q=something */}
          </nav>
          <div className="ml-auto flex items-center">
            {mainNavItems.map(({ path, label, showWhenLoggedIn }) => {
              if (session?.user) {
                if (!showWhenLoggedIn) {
                  return null
                }
              }

              return (
                <Link
                  href={path}
                  key={path}
                  className={cn(pathname === path ? "text-primary" : "")}
                >
                  <Button variant={"ghost"}>{label}</Button>
                </Link>
              )
            })}
            <div className="ml-2">
              <UserNav session={session} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
