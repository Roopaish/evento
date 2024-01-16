import { getServerAuthSession } from "~/server/auth"

export default async function Home() {
  const session = await getServerAuthSession()

  return <div className="container">Session: {JSON.stringify(session)}</div>
}
