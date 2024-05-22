import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"

export const kanbanRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!"
  }),

  getBoards: protectedProcedure.query(async ({ ctx }) => {
    const boards = await ctx.db.board.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        columns: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            name: true,
            tasks: {
              orderBy: { updatedAt: "desc" },
              select: {
                id: true,
                order: true,
                title: true,
                status: { select: { id: true } },
                description: true,
                subTasks: {
                  orderBy: { createdAt: "asc" },
                  select: {
                    id: true,
                    title: true,
                    isCompleted: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })
    return boards.map((board) => {
      const tasks = board.columns.flatMap((column) => column.tasks)
      return {
        id: board.id,
        name: board.name,
        tasks,
        columnsList: board.columns.map((column) => {
          return { name: column.name, id: column.id }
        }),
      }
    })
  }),

  postNewTask: protectedProcedure
    .input(
      z.object({
        boardID: z.number(),
        title: z.string(),
        description: z.string().optional(),
        status: z.string(),
        subtasks: z.array(z.string()),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          statusName: input.status,
          boardId: input.boardID,
          description: input.description,
          subTasks: {
            createMany: {
              data: input.subtasks.map((subtask) => {
                return { title: subtask }
              }),
            },
          },
        },
        select: {
          id: true,
          title: true,
          order: true,
          status: { select: { id: true } },
          description: true,
          subTasks: {
            orderBy: { createdAt: "asc" },
            select: {
              title: true,
              isCompleted: true,
              id: true,
            },
          },
        },
      })
    }),

  toggleSubtask: protectedProcedure
    .input(z.object({ id: z.number(), value: z.boolean() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.subTask.update({
        where: { id: input.id },
        data: { isCompleted: input.value },
      })
    }),

  moveTask: protectedProcedure
    .input(z.object({ taskID: z.number(), newColumnID: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.task.update({
        where: { id: input.taskID },
        data: { status: { connect: { id: input.newColumnID } } },
      })
    }),

  deleteTask: protectedProcedure
    .input(z.number())
    .mutation(({ input, ctx }) => {
      return ctx.db.task.delete({
        where: { id: input },
      })
    }),

  editBoard: protectedProcedure
    .input(
      z.object({
        boardID: z.number(),
        name: z.string(),
        columns: z.array(
          z.object({ name: z.string(), id: z.number().optional() })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const columnsToUpdate = input.columns.filter((column) => column.id)
      const columnsToCreate = input.columns.filter((column) => !column.id)
      await Promise.all(
        columnsToUpdate.map(
          async (column) =>
            await ctx.db.column.update({
              where: { id: column.id },
              data: { name: column.name },
            })
        )
      )
      const colIDStoNotDelete = columnsToUpdate.map((col) => col.id) as number[]
      await ctx.db.column.deleteMany({
        where: { id: { notIn: colIDStoNotDelete }, boardId: input.boardID },
      })
      const board = await ctx.db.board.update({
        where: { id: input.boardID },
        data: {
          name: input.name,
          columns: { createMany: { data: columnsToCreate } },
        },
        select: {
          id: true,
          name: true,
          columns: {
            orderBy: { id: "asc" },
            select: {
              name: true,
              id: true,
              tasks: {
                orderBy: { id: "asc" },
                select: {
                  title: true,
                  description: true,
                  order: true,
                  status: { select: { id: true } },
                  id: true,
                  subTasks: {
                    select: { id: true, title: true, isCompleted: true },
                  },
                },
              },
            },
          },
        },
      })
      if (board) {
        const tasks = board.columns.flatMap((column) => column.tasks)
        return {
          id: board.id,
          name: board.name,
          tasks,
          columnsList: board.columns.map((column) => {
            return { name: column.name, id: column.id }
          }),
        }
      }
      return board
    }),

  createBoard: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        columns: z.array(z.object({ name: z.string() })),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const board = await ctx.db.board.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          columns: { createMany: { data: input.columns } },
        },
        select: {
          id: true,
          name: true,
          columns: { select: { name: true, id: true } },
        },
      })
      return {
        id: board.id,
        name: board.name,
        tasks: [],
        columnsList: board.columns.map((column) => {
          return { name: column.name, id: column.id }
        }),
      }
    }),

  deleteBoard: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.board.delete({ where: { id: input.id } })
    }),

  editTask: protectedProcedure
    .input(
      z.object({
        taskID: z.number(),
        boardID: z.number(),
        title: z.string(),
        description: z.string().optional(),
        status: z.string(),
        subtasks: z.array(
          z.object({ title: z.string(), id: z.number().optional() })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const subtasksToUpdate = input.subtasks.filter((subtask) => subtask.id)
      await Promise.all(
        subtasksToUpdate.map(
          async (subtask) =>
            await ctx.db.subTask.update({
              where: { id: subtask.id },
              data: { title: subtask.title },
            })
        )
      )
      // deleting deleted subtasks
      const updatedIds = subtasksToUpdate.map(
        (subtask) => subtask.id
      ) as number[]
      await ctx.db.subTask.deleteMany({
        where: { id: { notIn: updatedIds }, taskId: input.taskID },
      })
      const subtasksToCreate = input.subtasks.filter((subtask) => !subtask.id)
      return ctx.db.task.update({
        where: { id: input.taskID },
        select: {
          id: true,
          title: true,
          status: { select: { id: true } },
          description: true,
          order: true,
          subTasks: {
            orderBy: { id: "asc" },
            select: {
              title: true,
              isCompleted: true,
              id: true,
            },
          },
        },
        data: {
          title: input.title,
          description: input.description,
          status: {
            connect: {
              name_boardId: { boardId: input.boardID, name: input.status },
            },
          },
          subTasks: { createMany: { data: subtasksToCreate } },
        },
      })
    }),

  updateOrders: protectedProcedure
    .input(
      z.array(
        z.object({ taskid: z.number(), colid: z.number(), order: z.number() })
      )
    )
    .mutation(async ({ input, ctx }) => {
      await Promise.all(
        input.map(
          async (taskInput) =>
            await ctx.db.task.update({
              where: { id: taskInput.taskid },
              data: {
                order: taskInput.order,
                status: { connect: { id: taskInput.colid } },
              },
            })
        )
      )
    }),
})
