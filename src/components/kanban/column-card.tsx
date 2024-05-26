import {
  useState,
  type DetailedHTMLProps,
  type Dispatch,
  type HTMLAttributes,
  type SetStateAction,
} from "react"
import { useDroppable } from "@dnd-kit/core"
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import type { Action } from "~/state/kanban/kanban-state"

import NewTask from "./new-task"
import Button from "./shared/button"
import Modal from "./shared/modal"
import TaskCard from "./task-card"

type ColumnCardProps = {
  colid: number
  dispatch: Dispatch<Action>
  parentSetShowModal: Dispatch<SetStateAction<boolean | number>>
  boardID: number
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
  dispatch,
  parentSetShowModal,
  boardID,
  tasks,
  name,
  ...props
}: ColumnCardProps) => {
  const currentCol = { name: name.toUpperCase(), id: colid }
  const [showModal, setShowModal] = useState<boolean | number>(false)
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
          <div
            className={` mr-3 h-[15px] w-[15px] rounded-full ${
              name.toLowerCase() === "todo"
                ? "bg-[#8471F2]"
                : name.toLowerCase() === "done"
                  ? "bg-[#67E2AE]"
                  : "bg-[#F9A109]"
            } `}
          ></div>
          <h2 className=" ... w-[17rem] truncate text-ellipsis text-hs uppercase text-mediumGrey">
            {name} ({tasks.length})
          </h2>
          <div
            className={`duration-10 group rounded-lg bg-[#8471F2] px-3 py-1 transition-opacity ${
              name.toLowerCase() === "todo"
                ? "opacity-100 hover:bg-[#F9A109]"
                : "opacity-30 hover:bg-[#8471F2] hover:text-white hover:opacity-100"
            }`}
          >
            <button
              onClick={() => {
                setShowModal(1)
              }}
              className={`text-white`}
            >
              +
            </button>
          </div>
        </div>
        {tasks.map((task) => (
          <TaskCard
            taskid={task.id}
            onClick={() => parentSetShowModal(task.id)}
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
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <NewTask
            boardID={boardID}
            setShowModal={setShowModal}
            cols={[currentCol]}
            dispatch={dispatch}
          />
        </Modal>
      )}
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
