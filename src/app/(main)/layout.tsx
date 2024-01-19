import { Header } from "../../components/header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header />
      <div className="mt-[60px] bg-background">{children}</div>
    </div>
  )
}
