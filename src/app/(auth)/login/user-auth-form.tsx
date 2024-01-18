"use client"

import * as React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Icons } from "~/components/ui/icons"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "email" | null
  >(null)

  const signInWithProvider = (provider: "google" | "email") => {
    setLoadingProvider(provider)

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
        setLoadingProvider(null)
      })
  }

  const onSubmit = () => {
    console.log("email")
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loadingProvider === "email"}
            />
          </div>
          <Button disabled={loadingProvider === "email"}>
            {loadingProvider === "email" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={loadingProvider === "google"}
        onClick={() => {
          signInWithProvider("google")
        }}
      >
        {loadingProvider === "google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}
