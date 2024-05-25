import { cn } from "@/lib/utils"

import { Icons } from "../ui/icons"

export default function SearchBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `flex w-full items-center rounded-full border border-gray-300 px-4 lg:max-w-2xl`,
        className
      )}
    >
      <input
        placeholder="Search Events"
        className="w-full flex-1 border-r border-gray-300 px-4 py-2 focus:outline-none"
      />
      <button className="flex items-center py-2 pl-2 lg:px-4">
        <Icons.Search className="h-4 w-5 lg:mr-2" />
        <span className="hidden lg:block">Search</span>
      </button>
    </div>
  )
}
