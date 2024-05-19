"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Session } from "next-auth"

import { mainNavItems } from "@/config/nav"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"

import UserNav from "./user-nav"

export default function Header({ session }: { session: Session | null }) {
  const pathname = usePathname()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-4  lg:space-x-6">
            <Link href={"/"} className="mr-11">
              <Icons.logo mode="light"></Icons.logo>
            </Link>

            {mainNavItems.map(({ path, label }) => (
              <Link
                href={path}
                key={path}
                className={cn(
                  "hidden whitespace-nowrap text-sm font-medium transition-colors hover:text-primary md:block",
                  pathname === path ? "text-primary" : ""
                )}
              >
                {label}
              </Link>
            ))}
            {/* TODO: On dashboard, show a event switch button to switch between events */}

            {/* TODO: Search Bar, Got to /search?q=something */}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav session={session} />
          </div>
        </div>
      </div>
    </header>
  )
}
