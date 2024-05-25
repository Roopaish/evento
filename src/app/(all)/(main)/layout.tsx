import { type ReactNode } from "react"

import Footer from "@/components/layout/footer"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
