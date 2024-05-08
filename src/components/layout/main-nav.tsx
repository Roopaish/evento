"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { mainNavItems } from "~/config/nav"
import { cn } from "~/lib/utils"
import { Icons } from "~/components/ui/icons"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex items-center space-x-4  lg:space-x-6", className)}
      {...props}
    >
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
    </nav>
  )
}
