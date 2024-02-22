// import { getServerAuthSession } from "~/server/auth"

import Image from "next/image"

import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { EventCard } from "~/components/event-card"
import { events } from "~/components/manage-events"

export default async function Home() {
  // const session = await getServerAuthSession()

  return (
    // <div className="container break-words">
    //   {/* Session: {JSON.stringify(session)} */}

    // </div>
    <>
      <section className="px-section">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <figure className="h-[500px] overflow-hidden rounded-[10px] lg:h-full">
              <Image
                className="h-full w-full object-cover "
                src="/home-page.jpg"
                alt="home page"
                width={1320}
                height={596}
              ></Image>
            </figure>
            <h2 className="absolute left-0  right-0 top-16 text-center text-4xl font-semibold text-white"></h2>
          </div>

          <div className="relative mx-5 -mt-20 justify-center  overflow-hidden rounded-3xl bg-blue-900 px-6  py-8 md:mx-10 md:px-[70px] md:py-9">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              <div className="w-full">
                <Label className="text-white">Looking for</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">When</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose date and time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-section">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <span className=" text-3xl font-semibold text-black">
                Upcoming{" "}
              </span>
              <span className="text-3xl font-semibold text-purple-600">
                Events
              </span>
            </div>
            <div className="flex gap-5">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Weekdays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-section">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map(({ img, eventDate, eventName, eventAddress }) => (
              <EventCard
                key={eventName}
                img={img}
                eventDate={eventDate}
                eventName={eventName}
                eventAddress={eventAddress}
                className="w-full"
              />
            ))}
          </div>
        </div>
      </section>
      <div className="text-center ">
        <Button>
          {/* <Icons.Loader className="mr-2 h-4 w-4" /> */}
          Load More
        </Button>
      </div>
      <div className="mb-20 mt-40 bg-blue-900">
        <section className="px-section">
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
    </>
  )
}
