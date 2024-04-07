"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type LucideIcon } from "lucide-react"
import { type Session } from "next-auth"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

import { dashboardRoutes, profileDropdownItems } from "~/config/nav"
import { cn, getInitials } from "~/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Icons } from "~/components/ui/icons"

export function UserNav({ session }: { session: Session | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
    return (
      <div className="flex gap-2 align-middle">
        <Link href="/login">
          <Button variant="secondary">Login</Button>
        </Link>
        <Link href="/register">
          <Button>Register</Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator
          className={cn(dashboardRoutes.includes(pathname) ? "lg:hidden" : "")}
        />
        <DropdownMenuGroup
          className={cn(dashboardRoutes.includes(pathname) ? "lg:hidden" : "")}
        >
          {profileDropdownItems.map(({ path, label, icon }) => {
            const Icon = !!icon ? (Icons[icon] as LucideIcon) : "div"

            return (
              <DropdownMenuItem
                key={path}
                onClick={() => {
                  router.push(path)
                }}
                className={cn(
                  "cursor-pointer",
                  pathname === path ? "text-primary" : ""
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
          className="cursor-pointer"
          onClick={async () => {
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
