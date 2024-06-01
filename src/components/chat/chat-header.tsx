import { Icons } from "../ui/icons"

export default function ChatHeader() {
  return (
    <div className="flex items-center  justify-between border-b-2 border-gray-200 p-4">
      <div className="flex -space-x-4 overflow-hidden">Avatar</div>
      <div className="font-semibold">title</div>
      <div>
        <Icons.threeDots />
      </div>
    </div>
  )
}
