"use client"

import Image from "next/image"

import { Button } from "../ui/button"

export default function CreateNewEventBanner() {
  return (
    <div className="mb-20 mt-40 bg-blue-900">
      <section className="container">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Image
            className="-mt-20"
            src="/calender.svg"
            alt="calender"
            width={400}
            height={320}
          ></Image>
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-semibold text-white">
              Make your own Event
            </h1>
            <p className="text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              sint amet, consequatur officia possimus illo, dolores tenetur
              impedit, commodi suscipit neque alias fugiat. Mollitia quae qui
              earum natus eaque cum.
            </p>
            <Button>Create Events</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
