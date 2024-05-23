import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Action } from "~/state/kanban/kanban-state"
import { api } from "~/trpc/react"
import { isBoolean } from "lodash"

import DeleteModal from "./delete-modal"
import NewTask from "./new-task"
import Card from "./shared/card"
import Checkbox from "./shared/checkbox"
import Dropdown from "./shared/dropdown"

type ViewTaskProps = {
  boardID: number
  cols: { name: string; id: number }[]
  task:
    | {
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
      }
    | undefined
  dispatch: Dispatch<Action>
  parentSetShowModal: Dispatch<SetStateAction<number | boolean>>
}
const ViewTask = ({
  cols,
  task,
  dispatch,
  boardID,
  parentSetShowModal,
}: ViewTaskProps) => {
  const [showSettings, setShowSettings] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState<boolean | number>(false)
  const deleteMutation = api.kanban.deleteTask.useMutation()
  if (!task) return <></>
  if (isBoolean(showModal))
    return (
      <Card
        onClick={(e) => {
          e.stopPropagation()
          if (showSettings) setShowSettings(false)
          if (showDropdown) setShowDropdown(false)
        }}
      >
        <div className="relative flex items-center justify-between pb-6">
          <h2 className="pr-6 text-hl text-black dark:text-white">
            {task.title}
          </h2>
          <svg
            onClick={() => setShowSettings(!showSettings)}
            width="6"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-2 cursor-pointer fill-mediumGrey hover:fill-purple dark:hover:fill-purpleHover"
          >
            <g fillRule="evenodd">
              <circle cx="2.308" cy="2.308" r="2.308" />
              <circle cx="2.308" cy="10" r="2.308" />
              <circle cx="2.308" cy="17.692" r="2.308" />
            </g>
          </svg>
          {showSettings && (
            <ul className="absolute -right-[24%] top-[70%] z-50 min-w-[12rem] cursor-pointer rounded-lg bg-white p-4 text-bodyl  text-mediumGrey dark:bg-veryDarkGrey">
              <li
                className="hover:text-black"
                onClick={() => {
                  setShowModal(-1)
                }}
              >
                Edit Task
              </li>
              <li
                onClick={() => setShowModal(-2)}
                className="pt-4 text-red hover:text-[#BC2727] dark:hover:text-redHover"
              >
                Delete Task
              </li>
            </ul>
          )}
        </div>
        <p
          className={`text-bodyl text-mediumGrey ${
            task.description ? "" : "hidden"
          }`}
        >
          {task.description}
        </p>
        <h3
          className={`pb-4 ${
            task.description ? "pt-6" : ""
          } text-bodym font-bold text-black dark:text-white ${
            task.subTasks.length === 0 ? "hidden" : ""
          } `}
        >
          Subtasks (
          {task.subTasks.filter((subtask) => subtask.isCompleted).length} of{" "}
          {task.subTasks.length} )
        </h3>
        {task.subTasks.map((subtask) => (
          <Checkbox
            className="mb-2"
            isCompleted={subtask.isCompleted}
            key={subtask.id}
            title={subtask.title}
            ids={{ taskID: task.id, subtaskID: subtask.id, boardID }}
            dispatch={dispatch}
          />
        ))}
        <h3 className="mt-6 pb-2 text-bodym font-bold text-black dark:text-white">
          Current Status
        </h3>
        <Dropdown
          dispatch={dispatch}
          columns={cols}
          currentColumn={task.status.id}
          taskID={task.id}
          boardID={boardID}
          active={showDropdown}
          setActive={setShowDropdown}
        />
      </Card>
    )
  return (
    <>
      {showModal === -1 ? (
        <NewTask
          boardID={boardID}
          task={task}
          cols={cols}
          setShowModal={parentSetShowModal}
          dispatch={dispatch}
        />
      ) : showModal === -2 ? (
        <DeleteModal
          onDelete={() => {
            deleteMutation.mutate(task.id)
            dispatch({
              type: "DELETE_TASK",
              payload: { id: task.id, boardID: boardID },
            })
            parentSetShowModal(false)
          }}
          type="task"
          title={task.title}
          setShowModal={parentSetShowModal}
        />
      ) : null}
    </>
  )
}

export default ViewTask
