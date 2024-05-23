import type {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react"
import { useDroppable } from "@dnd-kit/core"
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable"

import TaskCard from "./task-card"

type ColumnCardProps = {
  colid: number
  setShowModal: Dispatch<SetStateAction<boolean | number>>
  tasks: {
    subTasks: {
      id: number
      title: string
      isCompleted: boolean
    }[]
    id: number
    status: {
      id: number
    }
    title: string
    description: string | null
  }[]
  name: string
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const ColumnCard = ({
  colid,
  setShowModal,
  tasks,
  name,
  ...props
}: ColumnCardProps) => {
  const { setNodeRef } = useDroppable({
    id: colid,
    data: { colid },
  })
  return (
    <SortableContext
      id={`col${colid}`}
      items={tasks.map((task) => task.id)}
      strategy={rectSortingStrategy}
    >
      <div {...props} ref={setNodeRef}>
        <div className="flex items-center justify-start pb-6">
          <div className=" mr-3 h-[15px] w-[15px] rounded-full bg-[#49C4E5]"></div>
          <h2 className=" text-hs uppercase text-mediumGrey">
            {name} ({tasks.length})
          </h2>
        </div>
        {tasks.map((task) => (
          <TaskCard
            taskid={task.id}
            onClick={() => setShowModal(task.id)}
            key={task.id}
            numberOfCompletedSubtasks={
              task.subTasks.filter((subtask) => subtask.isCompleted).length
            }
            numberOfTotalSubtasks={task.subTasks.length}
            title={task.title}
            className="mb-5"
          />
        ))}
      </div>
    </SortableContext>
  )
}

export default ColumnCard

//
// col.Task.map((task) => {
//     return {
//       id: task.id,
//       title: task.title,
//       numberOfCompletedSubtasks:
//       numberOfTotalSubtasks: task.subTasks.length,
//     };
//   })
