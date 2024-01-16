import { redirect } from "next/navigation"
import { getServerAuthSession } from "~/server/auth"

import LoginForm from "./login-form"

export default async function LoginPage() {
  const session = await getServerAuthSession()

  if (!!session?.user) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  )
}
