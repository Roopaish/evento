// import { getServerAuthSession } from "~/server/auth"

import Image from "next/image"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export default async function Home() {
  // const session = await getServerAuthSession()

  return (
    // <div className="container break-words">
    //   {/* Session: {JSON.stringify(session)} */}

    // </div>
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
          <h2 className="absolute left-0  right-0 top-16 text-center text-4xl font-semibold text-white">
            Made for those who do
          </h2>
        </div>

        <div className="relative mx-10 -mt-20 h-[300px] bg-red-400">
          <div className="flex gap-4">
            <div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
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
  )
}
