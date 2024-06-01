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
    .input(
      taskFormSchema.extend({
        status: z.nativeEnum(TaskStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.currentEvent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No event found in context",
        })
      }
      const { taskDescription: description, assignedTo, ...restInput } = input

      const task = await ctx.db.task.create({
        data: {
          ...restInput,
          assignedTo: assignedTo ? { connect: { id: assignedTo } } : undefined,
          description,
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
      const {
        id,
        taskDescription: description,
        assignedTo,
        ...restInput
      } = input

      const task = await ctx.db.task.update({
        where: {
          id,
        },
        data: {
          ...restInput,
          assignedTo: assignedTo ? { connect: { id: assignedTo } } : undefined,
          description,
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
