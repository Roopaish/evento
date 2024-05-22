import type { Action, BoardType, StateType } from "./kanban-state"

export function reducer(state: StateType, action: Action): StateType {
  switch (action.type) {
    case "ADD_BOARD":
      return {
        activeBoardId: action.payload.id,
        boards: state.boards.concat(action.payload),
      }
    case "DELETE_BOARD":
      const newBoards = state.boards.filter(
        (board) => board.id !== action.payload
      )
      if (newBoards.length === 0)
        return {
          activeBoardId: -1,
          boards: [
            {
              name: "Some Event",
              id: -1,
              tasks: [],
              columnsList: [],
            } as BoardType,
          ],
        }
      return { activeBoardId: newBoards[0]!.id, boards: newBoards }
    case "CHANGE_BOARD":
      return { ...state, activeBoardId: action.payload }

    case "ADD_TASK":
      const { task } = action.payload
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          if (board.id === action.payload.boardID)
            return { ...board, tasks: board.tasks.concat(task) }
          return board
        }),
      }
    case "EDIT_TASK":
      const subtasksToBeUpdated = action.payload.subtasks.filter(
        (subtask) => subtask.id
      )
      const subtasksToBeCreated = action.payload.subtasks.filter(
        (subtask) => !subtask.id
      )
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          if (board.id === action.payload.boardID) {
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === action.payload.taskID) {
                  return {
                    id: task.id,
                    title: action.payload.title,
                    status: { id: action.payload.status },
                    order: task.order,
                    description: action.payload.description ?? null,
                    subTasks: [
                      ...task.subTasks.map((subtask) => {
                        for (
                          let index = 0;
                          index < subtasksToBeUpdated.length;
                          index++
                        ) {
                          if (subtask.id === subtasksToBeUpdated[index]?.id) {
                            subtask.title = subtasksToBeUpdated[index]!.title
                            subtasksToBeUpdated.splice(index, 1)
                            return subtask
                          }
                        }
                        return subtask
                      }),
                      ...subtasksToBeCreated.map((subtask) => {
                        return {
                          title: subtask.title,
                          isCompleted: false,
                          id: Math.floor(Math.random() * 1000000000000000),
                        }
                      }),
                    ],
                  }
                }
                return task
              }),
            }
          }
          return board
        }),
      }
    case "SILENT_EDIT_TASK":
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          if (board.id === action.payload.boardID) {
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === action.payload.task.id) {
                  return action.payload.task
                }
                return task
              }),
            }
          }
          return board
        }),
      }
    case "MOVE_TASK":
      const { newColumnID, taskID } = action.payload
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          let newOrder: number | undefined = undefined
          if (action.payload.overId) {
            newOrder = board.tasks.find(
              (task) => task.id === action.payload.overId
            )?.order
          }
          if (board.id === action.payload.boardID) {
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === taskID) {
                  return {
                    ...task,
                    status: { id: newColumnID },
                    order: newOrder ?? task.order,
                  }
                }
                if (newOrder && task.order >= newOrder)
                  return { ...task, order: task.order + 1 }
                return task
              }),
            }
          }
          return board
        }),
      }
    case "DELETE_TASK":
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          if (action.payload.boardID === board.id)
            return {
              ...board,
              tasks: board.tasks.filter(
                (task) => task.id !== action.payload.id
              ),
            }
          return board
        }),
      }
    case "TOGGLE_SUBTASK":
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          if (board.id === action.payload.boardID) {
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === action.payload.taskID) {
                  return {
                    ...task,
                    subTasks: task.subTasks.map((subtask) => {
                      if (subtask.id === action.payload.subtaskID) {
                        return {
                          ...subtask,
                          isCompleted: !subtask.isCompleted,
                        }
                      }
                      return subtask
                    }),
                  }
                }
                return task
              }),
            }
          }
          return board
        }),
      }
    case "POPULATE":
      return action.payload
    case "SILENT_EDIT_BOARD":
      return {
        activeBoardId: action.payload.id,
        boards: state.boards.map((board) => {
          if (board.id === action.payload.id) return action.payload.newBoard
          return board
        }),
      }
    case "EDIT_BOARD":
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          if (board.id === action.payload.boardID) {
            return {
              name: action.payload.name,
              columnsList: action.payload.columns.map((column) => {
                if (column.id) {
                  return { name: column.name, id: column.id }
                }
                return {
                  name: column.name,
                  id: Math.floor(Math.random() * 100000),
                }
              }),
              id: action.payload.boardID,
              tasks: board.tasks,
            }
          }
          return board
        }),
      }
    case "CHANGE_TASK_ORDER":
      return {
        activeBoardId: state.activeBoardId,
        boards: state.boards.map((board) => {
          if (board.id === state.activeBoardId) {
            const overOrder = board.tasks.find(
              (task) => task.id === action.payload.overTaskId
            )!.order
            if (!overOrder) return board
            const activeTask = board.tasks.find(
              (task) => task.id === action.payload.activeTaskId
            )
            if (!activeTask) return board
            const bigger = activeTask.order >= overOrder
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === action.payload.activeTaskId) {
                  return {
                    ...task,
                    order: !bigger ? overOrder + 1 : overOrder,
                  }
                }
                if (
                  task.status.id === action.payload.colId &&
                  (bigger ? task.order >= overOrder : task.order > overOrder) &&
                  task.id !== action.payload.activeTaskId
                )
                  return {
                    ...task,
                    order: task.order + 1,
                  }
                return task
              }),
            }
          }
          return board
        }),
      }
    default:
      return state
  }
}
