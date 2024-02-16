"use client"

import { useRouter } from "next/navigation"

import { Button } from "~/components/ui/button"
import { Icons } from "~/components/ui/icons"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import ManageEvents from "~/components/manage-events"

export default function Events() {
  const router = useRouter()

  return (
    <>
      <div className="my-6 flex justify-between">
        <Tabs defaultValue="ongoing" className="w-[400px] ">
          <TabsList>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          onClick={() => {
            router.push("/events/add")
          }}
        >
          <Icons.PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      <ManageEvents />
    </>
  )
}
