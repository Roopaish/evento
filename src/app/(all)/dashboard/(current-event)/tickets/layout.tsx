import TicketsTabs from "./tabs"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <TicketsTabs />
      <div className="mt-4">{children}</div>
    </div>
  )
}
