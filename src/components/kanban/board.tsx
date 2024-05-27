import { Icons } from "../ui/icons"
import { Text } from "../ui/text"
import TaskCard from "./task-card"

export default function Board({
  title,
  tasknumber,
}: {
  title: string
  tasknumber?: number
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="mt-4 flex space-x-6 px-10">
          <div className="flex w-64 ">
            <div className="flex h-10 items-center px-2">
              <Text variant="small" semibold>
                {title}
              </Text>
              <div className="bg-primary- ml-2 h-5 w-5 items-center justify-center rounded text-primary-500">
                <Text variant="small" semibold>
                  {tasknumber}
                </Text>
              </div>
            </div>
          </div>
          <button className="ml-auto flex h-6 w-6 items-center justify-center rounded text-primary-500 hover:bg-primary-500 hover:text-primary-100">
            <Icons.Plus />
          </button>
        </div>
        <div>
          <TaskCard
            title="task 1"
            date="july-12 "
            taskDetails="lightening fix "
          />
          <TaskCard
            title="task 2"
            date="May-28 "
            taskDetails="lightening fix "
          />
        </div>
      </div>
    </>
  )
}
