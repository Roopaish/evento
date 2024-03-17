"use client"

import { useState } from "react"
import Link from "next/link"
import { api } from "~/trpc/react"

export default function AboutPage() {
  const [num, setNumber] = useState<number>()
  api.event.randomNumber.useSubscription(undefined, {
    onData(n) {
      setNumber(n)
    },
  })

  return (
    <div>
      Here&apos;s a random number from a sub: {num} <br />
      <Link href="/">Index</Link>
    </div>
  )
}
