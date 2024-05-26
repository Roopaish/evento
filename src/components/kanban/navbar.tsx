import { useEffect, useState } from "react"
import type { Dispatch } from "react"
import type { Action } from "~/state/kanban/kanban-state"
import { api } from "~/trpc/react"

import DeleteModal from "./delete-modal"
import NewBoard from "./new-board"
import NewTask from "./new-task"
import Button from "./shared/button"
import Modal from "./shared/modal"

type NavbarProps = {
  // boardsList: { id: number; name: string }[];
  showSideBar: boolean
  boardName: string
  boardID: number
  colsList: {
    name: string
    id: number
  }[]
  dispatch: Dispatch<Action>
}
const Navbar = ({
  dispatch,
  // boardsList,
  boardID,
  showSideBar,
  boardName,
  colsList,
}: NavbarProps) => {
  const [showModal, setShowModal] = useState<boolean | number>(false)
  const [showSettings, setShowSettings] = useState(false)
  const deleteMutation = api.kanban.deleteBoard.useMutation()
  useEffect(() => {
    if (showSettings) {
      document.body.addEventListener("click", () => setShowSettings(false))
    }
    return () =>
      document.body.removeEventListener("click", () => setShowSettings(false))
  }, [showSettings])
  return (
    <>
      <div className="tablet:h-[5rem]  desktop:h-[6rem] flex h-16 w-full items-center justify-between border-b border-linesLight bg-white p-6 dark:border-linesDark dark:bg-darkGrey">
        <div className={showSideBar ? "" : "flex items-center justify-center "}>
          <h1
            className={`${
              showSideBar ? "" : "ml-8"
            } text-hxl capitalize text-black dark:text-white `}
          >
            {boardName}
          </h1>
        </div>
        <div className="relative flex items-center justify-evenly">
          <Button
            // onClick={() => {
            //   setShowModal(1)
            // }}
            cType="primaryL"
            className="mr-4 block w-[10.25rem]"
          >
            + Invite
          </Button>
          <svg
            onClick={(e) => {
              e.stopPropagation()
              setShowSettings(!showSettings)
            }}
            width="5"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer fill-mediumGrey hover:fill-purple dark:hover:fill-purpleHover"
          >
            <g fillRule="evenodd">
              <circle cx="2.308" cy="2.308" r="2.308" />
              <circle cx="2.308" cy="10" r="2.308" />
              <circle cx="2.308" cy="17.692" r="2.308" />
            </g>
          </svg>
          {showSettings && (
            <ul className="absolute right-[1.5%] top-[130%] min-w-[12rem] cursor-pointer rounded-lg bg-white p-4 text-bodyl  text-mediumGrey dark:bg-veryDarkGrey">
              <li
                className="hover:text-black dark:hover:text-lightGrey"
                onClick={() => {
                  setShowModal(2)
                }}
              >
                Edit Board
              </li>
              <li
                onClick={() => {
                  setShowModal(3)
                }}
                className="pt-4 text-red hover:text-[#BC2727] dark:hover:text-redHover"
              >
                Delete Board
              </li>
            </ul>
          )}
        </div>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          {showModal === 1 ? (
            <NewTask
              boardID={boardID}
              setShowModal={setShowModal}
              cols={colsList}
              dispatch={dispatch}
            />
          ) : showModal === 2 ? (
            <NewBoard
              setShowModal={setShowModal}
              board={{ name: boardName, columns: colsList, id: boardID }}
            />
          ) : (
            <DeleteModal
              type="board"
              title={boardName}
              onDelete={() => {
                // const createNewBoard = Boolean(boardsList.length === 1);
                // deleteMutation.mutate({ id: boardID, createNewBoard });
                deleteMutation.mutate({ id: boardID })
                dispatch({ type: "DELETE_BOARD", payload: boardID })
              }}
              setShowModal={setShowModal}
            />
          )}
        </Modal>
      )}
    </>
  )
}

export default Navbar
