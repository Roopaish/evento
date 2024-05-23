import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Action } from "~/state/kanban/kanban-state"
import { api } from "~/trpc/react"

type DropdownProps = {
  columns: { name: string; id: number }[]
  currentColumn: number
  dispatch: Dispatch<Action>
  active: boolean
  setActive: Dispatch<SetStateAction<boolean>>
  taskID: number
  boardID: number
}

const Dropdown = ({
  boardID,
  taskID,
  dispatch,
  columns,
  currentColumn,
  active,
  setActive,
}: DropdownProps) => {
  const [currCol, setCurrCol] = useState(currentColumn)
  const mutation = api.kanban.moveTask.useMutation()

  return (
    <>
      <div
        onClick={() => {
          setActive(!active)
        }}
        className={`relative mb-2 flex h-[40px]  cursor-pointer items-center justify-between rounded-[4px] border  ${
          active ? "border-purple" : "border-[#828FA3] border-opacity-25"
        }  px-4 py-2`}
      >
        <div className="text-bodyl text-black dark:text-white">
          {columns.find((col) => col.id === currCol)?.name}
        </div>
        <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
          <path stroke="#635FC7" strokeWidth="2" fill="none" d="m1 1 4 4 4-4" />
        </svg>
        <ul
          className={` absolute left-0 top-[120%] z-50 w-full rounded-lg  bg-white p-4  dark:bg-veryDarkGrey ${
            active ? "" : "hidden"
          } `}
        >
          {columns.map((col) => (
            <li
              onClick={() => {
                setCurrCol(col.id)
                mutation.mutate({ newColumnID: col.id, taskID })
                dispatch({
                  type: "MOVE_TASK",
                  payload: { taskID, newColumnID: col.id, boardID },
                })
                setActive(false)
              }}
              key={col.name}
              className="mb-2 cursor-pointer text-bodyl capitalize text-mediumGrey hover:text-black dark:hover:text-white"
            >
              {col.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Dropdown
