"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type LucideIcon } from "lucide-react"
import { type Session } from "next-auth"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

import { dashboardRoutes, profileDropdownItems } from "@/config/nav"
import { cn, getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

export default function UserNav({ session }: { session: Session | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [open, setOpen] = useState(false)

  const signOutUser = async () => {
    setIsLoggingOut(true)
    await signOut()
      .then(() => {
        toast.success("You are logged out!")
        router.push("/")
      })
      .catch(() => {
        toast.error("Failed to log out", { description: "Please try again!" })
      })
      .finally(() => {
        setIsLoggingOut(false)
      })
  }

  if (!session?.user) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? "avatar"}
            />
            <AvatarFallback className="bg-primary text-white">
              {session?.user?.name ? (
                getInitials(session?.user?.name)
              ) : (
                <Icons.User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="max-h-[75vh] w-64 overflow-y-auto md:w-80"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={session?.user?.image ?? ""}
                alt={session?.user?.name ?? "avatar"}
              />
              <AvatarFallback>
                {session?.user?.name ? (
                  getInitials(session?.user?.name)
                ) : (
                  <Icons.User className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <p className="mt-4 text-base font-normal leading-none">
              {session?.user?.name}
            </p>
            <p className="mt-2 text-base leading-none text-slate-700">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator
          className={cn(dashboardRoutes.includes(pathname) ? "lg:hidden" : "")}
        />
        <DropdownMenuGroup
          className={cn(
            dashboardRoutes.some((p) => pathname.includes(p))
              ? "lg:hidden"
              : "",
            "overflow-auto p-2"
          )}
        >
          {profileDropdownItems.map(({ path, label, icon }) => {
            const Icon = !!icon ? (Icons[icon] as LucideIcon) : "div"

            return (
              <DropdownMenuItem
                key={path}
                onClick={() => {
                  router.push(path)
                  setOpen(false)
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 hover:scale-105 hover:bg-primary-50 hover:text-primary focus:bg-primary-50 focus:text-primary active:scale-100",
                  pathname === path ? "bg-primary-50 text-primary" : ""
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <Link href={path}>{label}</Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-6 py-3 hover:scale-105 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 active:scale-100"
          onClick={async () => {
            setOpen(false)
            await signOutUser()
          }}
        >
          {isLoggingOut ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.LogOut className="mr-2 h-4 w-4" />
          )}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
