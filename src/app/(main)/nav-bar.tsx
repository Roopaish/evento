"use client"

import type { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
            id="mobile-menu-2"
          >
            <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
              <li>
                <Link
                  href="/"
                  className="bg-primary-700 lg:text-primary-700 block rounded py-2 pl-3 pr-4 lg:bg-transparent lg:p-0"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
