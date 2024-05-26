import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"
import UserEvents from "@/components/event/user-events"

export const metadata: Metadata = {
  title: "User | " + siteConfig.name,
  description: siteConfig.description,
}

export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <div className="container pt-14">
      <div className="mx-auto max-w-[600px]">
        <div className="flex gap-5">
          <div className="h-14 w-14 rounded-full md:h-28 md:w-28">
            <Avatar className="h-full w-full">
              <AvatarImage alt={"avatar"} />
              <AvatarFallback className="text-xl md:text-3xl">
                {getInitials("Rupesh Budhathoki")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Text variant={"h4"} medium>
              Rupesh Budhathoki
            </Text>
            <Text variant={"large"} className="mt-3 text-gray-500">
              69 properties listed
            </Text>
          </div>
        </div>
      </div>

      <UserEvents userId={params.id} />
    </div>
  )
}
