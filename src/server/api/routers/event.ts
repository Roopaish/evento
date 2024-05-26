import { type EventType } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import * as z from "zod"

import { eventFormSchema } from "@/lib/validations/event-form-validation"
import { SearchFiltersSchema } from "@/lib/validations/search-filter-schema"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

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

  getUserEvents: publicProcedure
    .input(
      SearchFiltersSchema.extend({ userId: z.string().optional().nullish() })
    )
    .query(async ({ ctx, input }) => {
      const { q, type, date, address, hasJobOffers, userId, ...pagination } =
        input

      if (!input.userId && !ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please login first!",
        })
      }

      const data = await ctx.db.event.findMany({
        take: pagination.limit + 1,
        cursor: pagination.cursor ? { id: pagination.cursor } : undefined,
        orderBy: {
          title: pagination.sortBy === "title" ? pagination.orderBy : undefined,
          createdAt:
            pagination.sortBy === "created_at" ? pagination.orderBy : undefined,
          updatedAt:
            pagination.sortBy === "updated_at" ? pagination.orderBy : undefined,
        },
        include: {
          assets: true,
        },
        where: {
          title: {
            contains: q,
          },
          type: type ? { equals: type as EventType } : undefined,
          date: date ? { equals: date } : undefined,
          address: address ? { contains: address } : undefined,
          jobPositions: hasJobOffers ? { some: {} } : undefined,
          createdById: userId
            ? { equals: userId }
            : { equals: ctx.session?.user.id },
        },
      })

      let nextCursor: number | undefined = undefined
      if (data.length > pagination.limit) {
        const nextItem = data.pop()
        nextCursor = nextItem?.id
      }

      return {
        data,
        nextCursor,
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

  getEvent: publicProcedure
    .input(z.object({ id: z.coerce.number() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findFirst({
        where: {
          id: input.id,
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

  getAll: publicProcedure
    .input(SearchFiltersSchema)
    .query(async ({ ctx, input }) => {
      const { q, type, date, address, hasJobOffers, ...pagination } = input

      const data = await ctx.db.event.findMany({
        take: pagination.limit + 1,
        cursor: pagination.cursor ? { id: pagination.cursor } : undefined,
        orderBy: {
          title: pagination.sortBy === "title" ? pagination.orderBy : undefined,
          createdAt:
            pagination.sortBy === "created_at" ? pagination.orderBy : undefined,
          updatedAt:
            pagination.sortBy === "updated_at" ? pagination.orderBy : undefined,
        },
        include: {
          assets: true,
        },
        where: {
          title: {
            contains: q,
          },
          type: type ? { equals: type as EventType } : undefined,
          date: date ? { equals: date } : undefined,
          address: address ? { contains: address } : undefined,
          jobPositions: hasJobOffers ? { some: {} } : undefined,
        },
      })

      let nextCursor: number | undefined = undefined
      if (data.length > pagination.limit) {
        const nextItem = data.pop()
        nextCursor = nextItem?.id
      }

      return {
        data,
        nextCursor,
      }
    }),
})
