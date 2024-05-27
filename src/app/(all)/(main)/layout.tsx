import { type ReactNode } from "react"

import Footer from "@/components/layout/footer"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  )
}
