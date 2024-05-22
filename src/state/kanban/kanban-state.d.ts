export type BoardType = {
  id: number
  name: string
  tasks: {
    order: number
    subTasks: {
      id: number
      title: string
      isCompleted: boolean
      frontendId?: boolean
    }[]
    id: number
    status: {
      id: number
    }
    title: string
    description: string | null
  }[]
  columnsList: {
    id: number
    name: string
  }[]
}

export type StateType = {
  boards: BoardType[]
  activeBoardId: number
}

export type Action =
  | EditBoard
  | SilentEditBoard
  | Populate
  | AddBoard
  | ChangeBoard
  | DeleteBoard
  | AddTask
  | EditTask
  | DeleteTask
  | ToggleSubtask
  | MoveTask
  | SilentEditTask
  | ChangeTaskOrder

type ChangeTaskOrder = {
  type: "CHANGE_TASK_ORDER"
  payload: { activeTaskId: number; overTaskId: number; colId: number }
}
type AddTask = {
  type: "ADD_TASK"
  payload: {
    task: {
      subTasks: {
        id: number
        title: string
        isCompleted: boolean
      }[]
      order: number
      id: number
      status: {
        id: number
      }
      title: string
      description: string | null
    }
    boardID: number
  }
}

type EditTask = {
  type: "EDIT_TASK"
  payload: {
    taskID: number
    boardID: number
    status: number
    title: string
    subtasks: { title: string; id?: number }[]
    description?: string
  }
}

type SilentEditTask = {
  type: "SILENT_EDIT_TASK"
  payload: {
    task: {
      subTasks: {
        id: number
        title: string
        isCompleted: boolean
      }[]
      id: number
      order: number
      status: {
        id: number
      }
      title: string
      description: string | null
    }
    boardID: number
  }
}

type EditBoard = {
  type: "EDIT_BOARD"
  payload: {
    boardID: number
    name: string
    columns: {
      name: string
      id?: number | undefined
    }[]
  }
}

type MoveTask = {
  type: "MOVE_TASK"
  payload: {
    taskID: number
    newColumnID: number
    boardID: number
    overId?: number
  }
}
type ToggleSubtask = {
  type: "TOGGLE_SUBTASK"
  payload: { taskID: number; subtaskID: number; boardID: number }
}

type DeleteBoard = {
  type: "DELETE_BOARD"
  payload: number
}

type ChangeBoard = {
  type: "CHANGE_BOARD"
  payload: number
}
type Populate = {
  type: "POPULATE"
  payload: StateType
}

type SilentEditBoard = {
  type: "SILENT_EDIT_BOARD"
  payload: { newBoard: BoardType; id: number }
}

type AddBoard = {
  type: "ADD_BOARD"
  payload: BoardType
}

type DeleteTask = {
  type: "DELETE_TASK"
  payload: { id: number; boardID: number }
}
