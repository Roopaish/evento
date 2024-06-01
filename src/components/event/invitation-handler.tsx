"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { api } from "@/trpc/react"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import { Text } from "../ui/text"

export default function InvitationHandler() {
  const searchParams = useSearchParams()

  const token = searchParams.get("token") ?? ""

  const { isLoading, error } = api.invitation.verify.useQuery(
    {
      token,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Text variant={"h4"} className="text-black">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Icons.spinner className="h-10 w-10 animate-spin" />
            "Joining event..."
          </div>
        )}
        {error ? (
          "Error: " + error.message
        ) : (
          <div className="flex flex-col items-center gap-4">
            You have successfully joined the event!
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        )}
      </Text>
    </div>
  )
}
