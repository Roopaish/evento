"use client"

import { type ReactNode } from "react"
import { TRPCReactProvider } from "@/trpc/react"
import { SessionProvider } from "next-auth/react"

import { Toaster } from "@/components/ui/sonner"

export default function Providers({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string
}) {
  return (
    <TRPCReactProvider cookies={cookies}>
      <SessionProvider>
        <Toaster closeButton richColors theme="light" />
        {children}
      </SessionProvider>
    </TRPCReactProvider>
  )
}
