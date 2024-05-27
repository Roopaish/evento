"use client"

import { usePathname, useRouter } from "next/navigation"
import { type NavItem } from "@/types"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export default function Sidebar({
  className,
  data,
}: {
  className?: string
  data: {
    title: string
    data: NavItem[]
  }[]
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {data?.map(({ title, data: children }) => (
          <div className="px-3 py-2" key={title}>
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {title}
            </h2>
            <div className="space-y-1">
              {children.map(({ icon, label, path }) => {
                const Icon = !!icon ? (Icons[icon] as LucideIcon) : "div"

                return (
                  <Button
                    variant={pathname === path ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      router.push(path)
                    }}
                    key={path}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
