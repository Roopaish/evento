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
        createdBy: true,
        assignedTo: true,
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

      // Check if the assignedTo email exists in the database
      if (assignedTo) {
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
          assignedTo: assignedTo
            ? { connect: assignedTo.map((mail) => ({ email: mail })) }
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
      const { id, assignedTo, ...restInput } = input

      // Check if the assignedTo email exists in the database
      if (assignedTo) {
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
          assignedTo: assignedTo
            ? { connect: assignedTo.map((mail) => ({ email: mail })) }
            : undefined,
        },
      })

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
