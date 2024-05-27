"use client"

import { useState } from "react"
import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function EventSwitcher({
  initialValue,
}: {
  initialValue?: number
}) {
  const [open, setOpen] = useState(false)
  const { currentEvent: event, setCurrentEvent } = useCurrentEventStore()

  const currentEvent = event ?? initialValue
  const { data: events } = api.event.getParticipatingEvents.useQuery()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-full justify-between md:max-w-max"
        >
          <span className="line-clamp-1">
            {currentEvent
              ? events?.find((event) => event?.id === currentEvent)?.title
              : "Select event..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search event..." />
          <CommandList>
            <CommandEmpty>No event found.</CommandEmpty>
            <CommandGroup>
              {events?.map((event) => (
                <CommandItem
                  key={event?.id}
                  value={`${event?.id}`}
                  onSelect={(currentValue) => {
                    setCurrentEvent(
                      Number(currentValue) === currentEvent
                        ? undefined
                        : Number(currentValue)
                    )
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentEvent === event.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {event.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
