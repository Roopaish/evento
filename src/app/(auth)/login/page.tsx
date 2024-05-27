import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"
import { AlertCircle } from "lucide-react"

import { miniSiteContent, siteConfig } from "@/config/site"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from "@/components/ui/icons"

import { UserAuthForm } from "../../../components/auth/user-auth-form"

export const metadata: Metadata = {
  title: "Login / Get Started",
  description: `Get started with ${siteConfig.name}`,
}

export default async function AuthenticationPage({
  searchParams,
}: {
  searchParams: {
    msg: string
  }
}) {
  const session = await getServerAuthSession()

  if (session?.user) {
    redirect("/")
  }

  return (
    <>
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            <Image
              src="/background.jpg"
              alt="Auth Login background"
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
              <footer className="text-sm">
                &copy; {siteConfig.name} {new Date().getFullYear()}
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="h-full p-8">
          <div className="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              {searchParams.msg === "unauthorized" ? (
                <Alert variant="destructive" className="text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Can't proceed</AlertTitle>
                  <AlertDescription>Please login to continue.</AlertDescription>
                </Alert>
              ) : (
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>
              )}
              <p className="text-sm text-muted-foreground">
                Enter your email to sign in to your account
              </p>
            </div>
            <UserAuthForm />
            <div className="px-8 text-center text-sm text-muted-foreground">
              <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Don&apos;t have an account? Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
