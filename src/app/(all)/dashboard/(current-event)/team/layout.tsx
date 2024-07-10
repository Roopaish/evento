import TeamTabs from "./tabs"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <TeamTabs />
      <div className="mt-4">{children}</div>
    </div>
  )
}
