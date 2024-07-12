import { type EventType } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import * as z from "zod"

import { eventFormSchema } from "@/lib/validations/event-form-validation"
import { SearchFiltersSchema } from "@/lib/validations/search-filter-schema"

import {
  createTRPCRouter,
  protectedEventProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

export const eventRouter = createTRPCRouter({
  addEvent: protectedProcedure
    .input(eventFormSchema)
    .mutation(({ input, ctx }) => {
      const { jobPositions, assets, managerImage, tags, ...rest } = input

      const event = ctx.db.event.create({
        data: {
          ...rest,
          tags: {
            connectOrCreate: tags?.map((tag) => {
              return {
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              }
            }),
          },
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
      const { jobPositions, assets, managerImage, id, tags, ...rest } = input

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
                id: job.id!,
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
          tags: {
            connectOrCreate: tags?.map((tag) => {
              return {
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              }
            }),
          },
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
          tags: true,
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
          tags: true,
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

  getEventParticipants: protectedEventProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.event.findFirst({
      select: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: true,
            image: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: true,
            image: true,
          },
        },
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
        id: ctx.currentEvent,
      },
    })

    return data
  }),

  updateUniqueVisit: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { eventId } = input

      const getCount = await ctx.db.event.findFirst({
        where: {
          id: eventId,
        },
        select: {
          uniqueVisit: true,
        },
      })
      if (!getCount?.uniqueVisit) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Event Creation has not implemented unique Visit",
        })
      }
      const increment = (getCount?.uniqueVisit || 0) + 1
      const event = await ctx.db.event.update({
        where: { id: eventId },
        data: { uniqueVisit: increment },
      })
      return event
    }),

  getInterested: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { eventId } = input
      return ctx.db.event.findFirst({
        where: {
          id: eventId,
        },
        select: {
          interested: true,
        },
      })
    }),

  setInterested: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { eventId } = input
      const intrestedCount = await ctx.db.event.findFirst({
        where: {
          id: eventId,
        },
        select: {
          interested: true,
        },
      })
      if (!intrestedCount?.interested) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Interested not set correctly",
        })
      }
      const increased = (intrestedCount?.interested || 0) + 1
      const increaseCount = await ctx.db.event.update({
        where: {
          id: eventId,
        },
        data: { interested: increased },
      })

      return increaseCount
    }),
})
