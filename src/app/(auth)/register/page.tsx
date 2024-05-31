import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { miniSiteContent, siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

import { UserAuthForm } from "../../../components/auth/user-auth-form"

export const metadata: Metadata = {
  title: "Register / Get Started",
  description: `Get started with ${siteConfig.name}`,
}

export default async function AuthenticationPage({
  searchParams,
}: {
  searchParams: {
    msg: string
    next?: string
  }
}) {
  const session = await getServerAuthSession()

  if (session?.user) {
    redirect("/")
  }

  return (
    <>
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href={`/login${
            searchParams.next ? `?next=${searchParams.next}` : ""
          }`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            <Image
              src="/auth-bg.jpg"
              alt="Auth background image"
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link href="/">
              <Icons.logo mode="dark"></Icons.logo>
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;{miniSiteContent.welcomeQuote}&rdquo;
              </p>
              <footer className="text-sm">Powered By Evento</footer>
            </blockquote>
          </div>
        </div>
        <div className="h-full p-8">
          <div className="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
