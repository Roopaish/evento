"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function useNextURL() {
  const searchParams = useSearchParams()
  const nextURL = searchParams.get("next")
  const router = useRouter()

  const redirect = () => {
    if (nextURL) {
      router.push(nextURL)
    }
  }

  return { redirect }
}
