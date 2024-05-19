"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import MyEvents from "@/components/event/my-events"

export default function Events() {
  const router = useRouter()

  return (
    <>
      <div className="my-6 flex justify-between">
        {/* <Tabs defaultValue="ongoing" className="w-[400px] ">
          <TabsList>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs> */}
        <Button
          onClick={() => {
            router.push("/dashboard/events/add")
          }}
          size="lg"
        >
          <Icons.Plus />
          Add Event
        </Button>
      </div>
      <MyEvents />
    </>
  )
}
