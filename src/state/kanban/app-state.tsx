import { createContext, useEffect, useReducer } from "react"
import type { Dispatch, ReactElement } from "react"
import { api } from "~/trpc/react"
import type { Session } from "next-auth"

import type { Action, BoardType } from "./kanban-state"
import { reducer } from "./reducer"

type AppStateContextProps = {
  activeBoard: BoardType
  boardsList: { id: number; name: string }[]
  dispatch: Dispatch<Action>
  getNumberOfBoards: () => number
  getActiveBoardName: () => string
  changeBoard: (newBoardId: number) => void
}

export const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
)

const AppStateProvider = ({
  children,
  session,
}: {
  children: ReactElement
  session: Session | null
}) => {
  const { data: boards, status: fetchStatus } = api.kanban.getBoards.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  )

  const [state, dispatch] = useReducer(
    reducer,
    boards
      ? { boards, activeBoardId: boards[0]?.id as number }
      : {
          boards: [{ name: "Some Event", id: -1, tasks: [], columnsList: [] }],
          activeBoardId: -1,
        }
  )

  useEffect(() => {
    if (fetchStatus === "success")
      if (boards.length > 0) {
        dispatch({
          type: "POPULATE",
          payload: { boards, activeBoardId: boards[0]?.id as number },
        })
      }
  }, [fetchStatus])
  if (fetchStatus === "loading") return <div className="">Loading</div>

  const changeBoard = (newBoardId: number) => {
    dispatch({ type: "CHANGE_BOARD", payload: newBoardId })
  }
  const getNumberOfBoards = () =>
    state.boards.map((board) => {
      return { name: board.name, id: board.id }
    }).length
  const activeBoard = state.boards.find(
    (board) => board.id === state.activeBoardId
  )!
  return (
    <AppStateContext.Provider
      value={{
        changeBoard,
        activeBoard,
        boardsList: state.boards.map((board) => {
          return { name: board.name, id: board.id }
        }),
        dispatch,
        getNumberOfBoards,
        getActiveBoardName: () => activeBoard.name,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export default AppStateProvider
