import { TRPCError } from "@trpc/server"
import * as z from "zod"

import { eventFormSchema } from "@/lib/validations/event-form-validation"
import { PaginatedInput } from "@/lib/validations/pagination"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const eventRouter = createTRPCRouter({
  addEvent: protectedProcedure
    .input(eventFormSchema)
    .mutation(({ input, ctx }) => {
      const { location, ...rest } = input

      const event = ctx.db.event.create({
        data: {
          ...rest,
          address: location.address,
          createdById: ctx.session.user.id,
        },
      })
      return event
    }),

  getMyEvents: protectedProcedure
    .input(PaginatedInput)
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, limit, sortBy, orderBy } = input

        const data = await ctx.db.event.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            title: sortBy === "title" ? orderBy : undefined,
            createdAt: sortBy === "created_at" ? orderBy : undefined,
            updatedAt: sortBy === "updated_at" ? orderBy : undefined,
          },
          include: {
            assets: true,
          },
          where: {
            createdById: ctx.session.user.id,
          },
        })

        let nextCursor: number | undefined = undefined
        if (data.length > limit) {
          const nextItem = data.pop()
          nextCursor = nextItem?.id
        }

        return {
          data,
          nextCursor,
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: e,
        })
      }
    }),

  getMyEvent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findFirst({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      })
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        })
      }
      return event
    }),
})
