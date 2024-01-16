"use client"

import { Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

export default function LoginForm() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const signInWithProvider = (provider: "google" | "facebook" | "email") => {
    if (provider === "google") {
      setIsGoogleLoading(true)
    }

    signIn(provider, {
      callbackUrl: "/",
    })
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsGoogleLoading(false)
      })
  }

  return (
    <div className="w-full max-w-80 text-center ">
      <Text variant="h3" semibold className="mb-4">
        Evento
      </Text>

      <Text variant="h4" semibold>
        Create an account
      </Text>
      <Text variant="bodyMedium">Use providers to create an account</Text>

      <Button
        className="mt-5 w-full"
        onClick={() => signInWithProvider("google")}
        disabled={isGoogleLoading}
      >
        {" "}
        <Mail className="mr-2 h-4 w-4" /> Continue with Google
      </Button>
    </div>
  )
}
