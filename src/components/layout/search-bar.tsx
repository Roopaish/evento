import { cn } from "@/lib/utils"

import { Icons } from "../ui/icons"

export default function SearchBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `flex w-full max-w-2xl items-center rounded-full border border-gray-300 px-4`,
        className
      )}
    >
      <input
        placeholder="Search Events"
        className="flex-1 border-r border-gray-300 px-4 py-2 focus:outline-none"
      />
      <button className="flex items-center px-4 py-2">
        <Icons.Search className="mr-2 h-4 w-5" />
        Search
      </button>
    </div>
  )
}
