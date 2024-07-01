import { useState } from "react"
import { type ChatGroup, type Event, type User } from "@prisma/client"

import { getInitials } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog"
import { Icons } from "../ui/icons"

import "@/components/ui/command"

import { ScrollArea } from "../ui/scroll-area"

interface ChatGroupProps extends ChatGroup {
  event: ChatEventProps
}

interface ChatEventProps extends Event {
  participants: User[]
  createdBy: User
}
export default function ChatHeader({
  chatGroup,
}: {
  chatGroup: ChatGroupProps
}) {
  const [borderColor, setBorderColor] = useState(false)

  function showBorder() {
    setBorderColor(!borderColor)
  }

  return (
    <div className="flex items-center  justify-between border-b-2 border-gray-200 p-3">
      <Dialog>
        <DialogTrigger>
          <div
            onClick={showBorder}
            className="flex items-center gap-2 rounded-lg border-[1.5px] p-1.5 transition delay-100 hover:border-[1.5px] hover:border-[rgb(22,163,74)]"
          >
            <div className="flex max-w-[80px] cursor-pointer -space-x-2 overflow-hidden">
              <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-100">
                <AvatarImage
                  src={chatGroup?.event.createdBy.image ?? ""}
                  alt="user image"
                />
                <AvatarFallback>
                  {getInitials(
                    chatGroup?.event?.createdBy.name ??
                      chatGroup?.event?.createdBy.email
                  )}
                </AvatarFallback>
              </Avatar>

              {chatGroup?.event.participants
                .filter((item, index) => index < 2)
                .map((user) => (
                  <Avatar
                    key={user?.id}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-100"
                  >
                    <AvatarImage src={user.image!} alt="user image" />
                    <AvatarFallback>
                      {getInitials(user?.name ?? user?.email)}
                    </AvatarFallback>
                  </Avatar>
                ))}
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md border-[1px] border-[rgb(22,163,74)] font-semibold ring-slate-100">
              {chatGroup?.event.participants.length + 1}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="rounded-lg">
          <DialogClose onClick={showBorder} />
          <Command className="mt-2 p-1">
            <CommandInput placeholder="Find members" />
            <CommandList className="overflow-hidden">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="manager">
                <CommandItem className="flex gap-5">
                  <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-100">
                    <AvatarImage
                      src={chatGroup?.event.createdBy.image ?? ""}
                      alt="user image"
                    />
                    <AvatarFallback>
                      {getInitials(
                        chatGroup?.event?.createdBy.name ??
                          chatGroup?.event?.createdBy.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>{chatGroup?.event?.createdBy.name}</div>
                  <div>{chatGroup?.event?.createdBy.email}</div>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />

              <CommandGroup heading="members">
                <ScrollArea className="h-[300px]">
                  {chatGroup?.event.participants.map((user) => (
                    <CommandItem key={user?.id} className="flex gap-4">
                      <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-100">
                        <AvatarImage src={user.image!} alt="user image" />
                        <AvatarFallback>
                          {getInitials(user?.name ?? user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>{user?.name}</div>
                      <div>{user?.email}</div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <div className="font-semibold">{chatGroup?.event.title}</div>
      <div>
        <Icons.threeDots />
      </div>
    </div>
  )
}
