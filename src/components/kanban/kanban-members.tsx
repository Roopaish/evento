import { useState } from "react"

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

import type { Event } from "@/types"

import { ScrollArea } from "../ui/scroll-area"

export default function KanbanMembers({ event }: { event?: Event }) {
  const [borderColor, setBorderColor] = useState(false)

  function showBorder() {
    setBorderColor(!borderColor)
  }

  return (
    <div className="flex items-center  justify-between border-b-2 border-gray-200 p-4">
      <Dialog>
        <DialogTrigger>
          <div
            onClick={showBorder}
            className={`flex items-center gap-1 rounded-lg border-[1.5px] p-1.5 transition delay-100 hover:border-[1.5px] hover:border-[rgb(22,163,74)] ${
              borderColor ? "border-[rgb(22,163,74)]" : null
            }`}
          >
            <div className="flex w-[80px] cursor-pointer -space-x-2 overflow-hidden">
              <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-100">
                <AvatarImage
                  src={event?.createdBy.image ?? ""}
                  alt="user image"
                />
                <AvatarFallback>
                  {getInitials(event?.createdBy.name ?? event?.createdBy.email)}
                </AvatarFallback>
              </Avatar>

              {event?.participants
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
              {event?.participants.length}+
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
                      src={event?.createdBy.image ?? ""}
                      alt="user image"
                    />
                    <AvatarFallback>
                      {getInitials(
                        event?.createdBy.name ?? event?.createdBy.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>{event?.createdBy.name}</div>
                  <div>{event?.createdBy.email}</div>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />

              <CommandGroup heading="members">
                <ScrollArea className="h-[300px]">
                  {event?.participants.map((user) => (
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

      <div className="font-extrabold capitalize">{event?.title}</div>
      <div>
        <Icons.threeDots />
      </div>
    </div>
  )
}
