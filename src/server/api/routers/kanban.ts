import { TaskStatus } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { taskFormSchema } from "@/lib/validations/task-form-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const kanbanRouter = createTRPCRouter({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.currentEvent) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No event found in context",
      })
    }

    const tasks = await ctx.db.task.findMany({
      where: {
        eventId: ctx.currentEvent,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })
    const pending = tasks.filter((task) => task.status === TaskStatus.PENDING)
    const in_progress = tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    )
    const completed = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    )

    return { pending, in_progress, completed }
  }),

  findMembersFromEvent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.currentEvent) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No event found in context",
      })
    }

    const event = await ctx.db.event.findUnique({
      where: {
        id: ctx.currentEvent,
      },
      select: {
        id: true,
        title: true,
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return event ?? undefined
  }),

  addTask: protectedProcedure
    .input(taskFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.currentEvent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No event found in context",
        })
      }

      const { assignedTo, ...restInput } = input

      // const { assignedTo: assigned, ...restInput } = input

      // // assignedTo is id of the users for simplicity
      // const assignedTo = assigned.map((assignee) => assignee.id)

      // Check if the assignedTo email exists in the database
      if (assignedTo.length > 0) {
        try {
          const assignedToExists = await ctx.db.user.findMany({
            where: {
              email: { in: assignedTo },
            },
          })
          if (assignedToExists.length < assignedTo.length) {
            throw new Error("One or more assigned users not found")
          }
        } catch (error) {
          throw error
        }
      }

      const task = await ctx.db.task.create({
        data: {
          ...restInput,
          assignedTo:
            assignedTo.length > 0
              ? { connect: assignedTo.map((email) => ({ email })) }
              : undefined,
          eventId: ctx.currentEvent,
          createdById: ctx.session.user.id,
        },
      })

      return task
    }),

  editTask: protectedProcedure
    .input(
      taskFormSchema.extend({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, assignedTo, dueDate, ...restInput } = input

      // const { id, assignedTo: assigned, dueDate, ...restInput } = input

      // // assignedTo is id of the users for simplicity
      // const assignedTo = assigned.map((assignee) => assignee.id)

      // Check if the assignedTo email exists in the database
      if (assignedTo.length > 0) {
        try {
          const assignedToExists = await ctx.db.user.findMany({
            where: {
              email: { in: assignedTo },
            },
          })
          if (assignedToExists.length < assignedTo.length) {
            throw new Error("One or more assigned users not found")
          }
        } catch (error) {
          throw error
        }
      }

      const task = await ctx.db.task.update({
        where: {
          id,
        },
        include: {
          assignedTo: true,
        },
        data: {
          ...restInput,
          dueDate: dueDate ?? null,
          assignedTo:
            assignedTo.length > 0
              ? { connect: assignedTo.map((email) => ({ email })) }
              : undefined,
        },
      })

      // check if assignedTo and task.assignedTo.email are same or not
      // if not same, then disconnect the old assignedTo
      const assignedTos = task.assignedTo.map((user) => user.email)
      const newAssignedTos = assignedTo ?? []
      const toDisconnect = assignedTos.filter(
        (p) => !newAssignedTos.includes(p)
      )

      if (toDisconnect.length > 0) {
        await ctx.db.task.update({
          where: {
            id,
          },
          data: {
            assignedTo: {
              disconnect: toDisconnect.map((email) => ({ email })),
            },
          },
        })
      }

      return task
    }),

  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
