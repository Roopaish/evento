"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Session } from "next-auth"

import { mainNavItems } from "@/config/nav"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "../ui/button"
import EventSwitcher from "./event-switcher"
import SearchBar from "./search-bar"
import UserNav from "./user-nav"

export default function Header({
  session,
  currentEvent,
}: {
  session: Session | null
  currentEvent?: number
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isAuthenticated = !!session?.user

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-background">
      <div className="border-b py-3">
        <div className="hidden items-center  px-4 md:flex">
          <nav className="flex flex-1 items-center  space-x-4 lg:space-x-6">
            <Link href={"/"} className="mr-4">
              <Icons.logo mode="light"></Icons.logo>
            </Link>

            {pathname.startsWith("/dashboard") ? (
              <EventSwitcher initialValue={currentEvent} />
            ) : (
              <SearchBar />
            )}
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

        <div className="px-4 md:hidden">
          <nav
            className={cn(
              "flex items-center justify-between",
              pathname.includes("/dashboard") ? "" : "mb-2"
            )}
          >
            <div className="flex items-center">
              <Link href={"/"} className="mr-4">
                <Icons.logo mode="light"></Icons.logo>
              </Link>
              {pathname.startsWith("/dashboard") && (
                <EventSwitcher initialValue={currentEvent} />
              )}
            </div>
            <div className="flex items-center">
              {!isAuthenticated && (
                <>
                  <Link href="/login" className="hidden sm:block">
                    <Button variant={"ghost"}>Login</Button>
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button variant={"ghost"}>Register</Button>
                  </Link>
                </>
              )}

              <div className="mr-2">
                <UserNav session={session} />
              </div>

              <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
                <SheetTrigger>
                  <Icons.Menu className="cursor-pointer" />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription>
                      <div
                        className="flex flex-col"
                        onClick={() => {
                          setOpen(false)
                        }}
                      >
                        <Link href="/search">
                          <Button variant={"outline"} className="w-full">
                            Find Event
                          </Button>
                        </Link>
                        <Link href="/dashboard/events/add">
                          <Button variant={"outline"} className="w-full">
                            Create Event
                          </Button>
                        </Link>
                        {!isAuthenticated && (
                          <>
                            <Link href="/login">
                              <Button variant={"outline"} className="w-full">
                                Login
                              </Button>
                            </Link>
                            <Link href="/register">
                              <Button variant={"outline"} className="w-full">
                                Register
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </nav>

          {pathname.includes("/dashboard") ? null : <SearchBar />}
        </div>
      </div>
    </header>
  )
}
