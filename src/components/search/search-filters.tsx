"use client"

import { Label } from "@radix-ui/react-dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export default function SearchFilters() {
  return (
    <section className="container">
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
    </section>
  )
}
