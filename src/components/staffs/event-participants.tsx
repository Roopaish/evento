"use client"

import { api } from "@/trpc/react"

import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Icons } from "../ui/icons"
import { Text } from "../ui/text"

export default function EventParticipants() {
  const { data } = api.event.getEventParticipants.useQuery()

  return (
    <>
      <Text variant={"medium"} className="mb-4" medium>
        Event Participants
      </Text>

      <div className="flex flex-wrap gap-4">
        {[data?.createdBy, ...(data?.participants ?? [])]?.map(
          (participant) => {
            if (!participant) return null
            return (
              <div key={participant.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="bg-primary-50 h-12 w-12">
                    <AvatarImage
                      src={participant.image ?? ""}
                      alt={participant.name ?? "avatar"}
                    />
                    <AvatarFallback className="bg-primary text-white">
                      {participant.name ? (
                        getInitials(participant.name)
                      ) : (
                        <Icons.User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg">
                      {participant.name ?? participant.email?.split("@")[0]}
                    </h3>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                  </div>
                </div>
              </div>
            )
          }
        )}
      </div>
    </>
  )
}
