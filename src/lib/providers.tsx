"use client"

import { type ReactNode } from "react"
import { TRPCReactProvider } from "@/trpc/react"

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
      <Toaster closeButton richColors theme="light" />
      {children}
    </TRPCReactProvider>
  )
}
