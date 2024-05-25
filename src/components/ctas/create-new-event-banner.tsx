"use client"

import Image from "next/image"

import { Button } from "../ui/button"

export default function CreateNewEventBanner() {
  return (
    <div className="container pt-20">
      <div className="container mx-auto max-w-6xl rounded-xl bg-primary">
        <div className="flex flex-col justify-around md:flex-row">
          <Image
            className="-mt-20"
            src="/events.svg"
            alt="events"
            width={400}
            height={320}
          ></Image>
          <div className="space-y-4 py-10">
            <h1 className="text-4xl font-semibold text-white">
              Make your own Event
            </h1>
            <p className="text-white">
              Create your own event and start managing your events with ease.
            </p>
            <Button variant={"outline"}>Create Events</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
