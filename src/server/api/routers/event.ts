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
      const { jobPositions, assets, managerImage, ...rest } = input

      const event = ctx.db.event.create({
        data: {
          ...rest,
          assets: {
            connect: assets?.map(({ id }) => {
              return {
                id,
              }
            }),
          },
          managerImage: managerImage
            ? {
                connect: {
                  id: managerImage.id,
                },
              }
            : undefined,
          jobPositions: jobPositions
            ? {
                createMany: {
                  data: jobPositions.map((job) => {
                    return {
                      title: job.title,
                      description: job.description,
                      noOfEmployees: job.noOfEmployees,
                      salary: job.salary,
                    }
                  }),
                },
              }
            : undefined,
          createdById: ctx.session.user.id,
          chatGroup: {
            create: {
              messages: {
                create: {
                  message: `Chat group created for ${rest?.title}!`,
                  userId: ctx.session.user.id,
                },
              },
            },
          },
        },
      })
      return event
    }),

  editEvent: protectedProcedure
    .input(
      eventFormSchema.extend({
        id: z.coerce.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { jobPositions, assets, managerImage, id, ...rest } = input

      const existingJobPositions = await ctx.db.jobPosition.findMany({
        where: {
          eventId: id,
        },
      })

      const jobPositionsToCreate =
        jobPositions
          ?.filter((job) => !job.id)
          .map((job) => {
            return {
              title: job.title,
              description: job.description,
              noOfEmployees: job.noOfEmployees,
              salary: job.salary,
            }
          }) ?? []

      const jobPositionsToUpdate =
        jobPositions
          ?.filter((job) => job.id)
          .map((job) => {
            return {
              where: {
                id: job.id as number,
              },
              data: {
                title: job.title,
                description: job.description,
                noOfEmployees: job.noOfEmployees,
                salary: job.salary,
              },
            }
          }) ?? []

      const jobPositionsToDelete = existingJobPositions
        .map((job) => job.id)
        .filter((id) => !(jobPositions ?? []).map((job) => job.id).includes(id))

      const event = ctx.db.event.update({
        where: {
          id,
        },
        data: {
          ...rest,
          assets: {
            connect: assets?.map(({ id }) => {
              return {
                id,
              }
            }),
          },
          managerImage: managerImage
            ? {
                connect: {
                  id: managerImage.id,
                },
              }
            : undefined,
          jobPositions: jobPositions
            ? {
                createMany: {
                  data: jobPositionsToCreate,
                },
                updateMany: jobPositionsToUpdate,
                deleteMany: {
                  id: {
                    in: jobPositionsToDelete,
                  },
                },
              }
            : undefined,
        },
      })
      return event
    }),

  getParticipatingEvents: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.event.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
        OR: [
          {
            participants: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
          {
            createdById: ctx.session.user.id,
          },
        ],
      },
    })

    return data
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
        cursor:
          typeof pagination.cursor === "number"
            ? { id: pagination.cursor }
            : undefined,
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
            mode: "insensitive",
          },
          type: type ? { equals: type as EventType } : undefined,
          date: date ? { equals: date } : undefined,
          address: address
            ? { contains: address, mode: "insensitive" }
            : undefined,
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
      console.log(ctx.currentEvent)
      const event = await ctx.db.event.findFirst({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
        include: {
          assets: true,
          jobPositions: true,
          managerImage: true,
          createdBy: true,
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
        include: {
          assets: true,
          jobPositions: true,
          managerImage: true,
          createdBy: true,
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
        cursor:
          typeof pagination.cursor === "number"
            ? { id: pagination.cursor }
            : undefined,
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
            mode: "insensitive",
          },
          type: type ? { equals: type as EventType } : undefined,
          date: date ? { equals: date } : undefined,
          address: address
            ? { contains: address, mode: "insensitive" }
            : undefined,
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
