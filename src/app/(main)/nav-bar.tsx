"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Session } from "next-auth"
import { signOut } from "next-auth/react"

import { Button } from "~/components/ui/button"

export default function Navbar({ session }: { session: Session | null }) {
  const router = useRouter()

  return (
    <header>
      <nav className="border border-gray-200 bg-white px-4 py-2.5 lg:px-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="self-center whitespace-nowrap text-xl font-semibold">
              Evento
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            {session?.user ? (
              <>
                {session?.user?.name}
                <Button onClick={() => signOut()} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    router.push("/login")
                  }}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => {
                    router.push("/login")
                  }}
                >
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
