"use client"

import * as React from "react"
import { useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Icons } from "~/components/ui/icons"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>
const authFormSchema = z.object({
  email: z.string().email(),
})
type FormData = z.infer<typeof authFormSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isLogin = pathname === "/login"

  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "email" | "github" | null
  >(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(authFormSchema),
  })

  const signInWithProvider = (provider: "google" | "email" | "github") => {
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

  async function onSubmit(data: FormData) {
    console.log("ok")
    try {
      setLoadingProvider("email")

      const signInResult = await signIn("email", {
        email: data.email.toLowerCase(),
        redirect: false,
        callbackUrl: searchParams?.get("from") ?? "/",
      })

      if (!signInResult?.ok) {
        return toast.error("Something went wrong.", {
          description: "Your sign in request failed. Please try again.",
        })
      }

      return toast.success("Check your mail.", {
        description:
          "We sent you a login link. Be sure to check your spam too.",
      })
    } catch (e) {
      return toast.error("Something went wrong.", {
        description: "Your sign in request failed. Please try again.",
      })
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register("email", { required: true })} // Fix: Include the correct field name as a parameter
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button disabled={loadingProvider === "email"} type="submit">
            {loadingProvider === "email" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign {isLogin ? "In" : "Up"} with Email
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
      <Button
        variant="outline"
        type="button"
        disabled={loadingProvider === "github"}
        onClick={() => {
          signInWithProvider("github")
        }}
      >
        {loadingProvider === "github" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.github className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  )
}
