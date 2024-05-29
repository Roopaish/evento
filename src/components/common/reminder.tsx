import { Icons } from "../ui/icons"
import { Text } from "../ui/text"

export default function Reminder() {
  return (
    <>
      <div className="flex flex-col items-center lg:flex-row lg:items-end lg:gap-4">
        <Icons.curveArrow className="w-40" />

        <Text variant={"h3"} className="font-sofia italic text-black">
          Please select an event first
        </Text>
      </div>
    </>
  )
}
