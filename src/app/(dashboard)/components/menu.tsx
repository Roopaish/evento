"use client"

import { useRouter } from "next/navigation"

import { Icons } from "~/components/ui/icons"
import { Menubar, MenubarMenu, MenubarTrigger } from "~/components/ui/menubar"

export function Menu() {
  const router = useRouter()
  return (
    <Menubar className="h-auto rounded-none border-b border-none px-2 py-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger
          onClick={() => {
            router.push("/")
          }}
        >
          <Icons.logo mode="light"></Icons.logo>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}
