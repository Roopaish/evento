import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

export const metadata: Metadata = {
  title: "Analytics | " + siteConfig.name,
  description: siteConfig.description,
}

export default function AnalyticsPage() {
  return (
    <>
      <div className="mb-10 grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((p, i) => {
          const Icon = Icons.AArrowDown

          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Title</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
