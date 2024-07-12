import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const ticketRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        length: z.number(),
        width: z.number(),
        ticketInfo: z.array(
          z.object({
            position: z.string(),
            label: z.string(),
            price: z.number(),
            color: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const eventId = ctx.currentEvent
      const savedData = await ctx.db.ticket.findMany({
        where: {
          eventId: eventId!,
        },
      })

      // Create a map for quick lookup of existing tickets by position
      const savedDataMap = new Map<number, (typeof savedData)[0]>()
      savedData.forEach((data) => {
        savedDataMap.set(Number(data.position), data)
      })

      // Positions in the new ticket info
      const newPositions = new Set(
        input.ticketInfo.map((ticket) => ticket.position)
      )

      // Update or create tickets
      for (const ticket of input.ticketInfo) {
        const existingTicket = savedDataMap.get(Number(ticket.position))

        if (existingTicket) {
          const updates: Partial<typeof existingTicket> = {}

          if (existingTicket.label !== ticket.label) {
            updates.label = ticket.label
          }
          if (Number(existingTicket.price) !== ticket.price) {
            updates.price = ticket.price.toString()
          }
          if (existingTicket.color !== ticket.color) {
            updates.color = ticket.color
          }
          if (existingTicket.length !== input.length) {
            updates.length = input.length
          }
          if (existingTicket.width !== input.width) {
            updates.width = input.width
          }

          if (Object.keys(updates).length > 0) {
            await ctx.db.ticket.update({
              where: { id: existingTicket.id },
              data: updates,
            })
          }
        } else {
          await ctx.db.ticket.create({
            data: {
              eventId: eventId!,
              length: input.length,
              width: input.width,
              position: Number(ticket.position), // Position as number
              label: ticket.label,
              price: ticket.price.toString(),
              color: ticket.color,
            },
          })
        }
      }

      for (const [position, data] of savedDataMap) {
        if (!newPositions.has(position.toString())) {
          await ctx.db.ticket.delete({
            where: { id: data.id },
          })
        }
      }

      for (const [position, data] of savedDataMap) {
        if (position > input.length * input.width) {
          await ctx.db.ticket.delete({
            where: { id: data.id },
          })
        }
      }
    }),

  getTicketBySessionEventId: protectedProcedure.query(async ({ ctx }) => {
    const eventId = ctx.currentEvent
    return ctx.db.ticket.findMany({
      where: {
        eventId: eventId!,
      },
    })
  }),

  getTicketByEventId: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      // console.log("event",input.eventId)
      return ctx.db.ticket.findMany({
        where: {
          eventId: input.eventId,
        },
        include: {
          event: {
            include: {
              assets: true,
            },
          },
        },
      })
    }),

  getTicketTypeAndSale: protectedProcedure.query(async ({ ctx }) => {
    const eventId = ctx.currentEvent
    if (!eventId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not Found",
      })
    }
    const label = await ctx.db.ticket.groupBy({
      by: ["label"],
      where: {
        eventId: eventId,
      },
    })

    // const ticketSale = await ctx.db.bookingUserInfo.findMany({
    //   where: {
    //     eventId: eventId,
    //   },

    return { label }
  }),

  createTicketInfo: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        price: z.number(),
        color: z.string(),
        totalSeats: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const eventId = ctx.currentEvent
      await ctx.db.ticketInfo.create({
        data: {
          eventId: eventId!,
          ticketType: input.type,
          price: input.price,
          color: input.color,
          totalSeats: input.totalSeats,
        },
      })
    }),

  updateTicketInfo: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        price: z.number(),
        color: z.string(),
        ticketId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const eventId = ctx.currentEvent
      const previousData = await ctx.db.ticketInfo.findUnique({
        where: {
          id: input.ticketId,
        },
      })
      await ctx.db.ticketInfo.update({
        where: {
          id: input.ticketId,
        },
        data: {
          ticketType: input.type,
          price: input.price,
          color: input.color,
        },
      })

      await ctx.db.ticket.updateMany({
        where: {
          label: previousData?.ticketType,
        },
        data: {
          label: input.type,
          price: input.price.toString(),
          color: input.color,
        },
      })
    }),

  deleteTicketInfo: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // const eventId = ctx.currentEvent
      const ticket = await ctx.db.ticketInfo.delete({
        where: {
          id: input.ticketId,
        },
      })

      await ctx.db.ticket.deleteMany({
        where: {
          label: ticket.ticketType,
        },
      })
    }),

  getTicketInfoBySessionEventId: protectedProcedure.query(async ({ ctx }) => {
    const eventId = ctx.currentEvent
    return await ctx.db.ticketInfo.findMany({
      where: {
        eventId: eventId!,
      },
    })
  }),
  getTicketInfo: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const ticketInfo = await ctx.db.ticketInfo.findMany({
        where: {
          eventId: input.eventId,
        },
      })
      return ticketInfo
    }),
  getTicketAnalyticInfo: protectedProcedure.query(async ({ ctx }) => {
    const eventId = ctx.currentEvent
    if (!eventId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "None",
      })
    }
    const ticketInfo = await ctx.db.ticketInfo.findMany({
      where: {
        eventId: eventId,
      },
    })
    return ticketInfo
  }),

  getSavedTicketInfo: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      // return await ctx.db.ticketInfo.findMany({
      //   where:{
      //     eventId:input.eventId
      //   }

      const savedTicket = await ctx.db.ticket.findMany({
        where: {
          eventId: input.eventId,
        },
      })

      const ticketInfo = await ctx.db.ticketInfo.findMany({
        where: {
          eventId: input.eventId,
        },
      })

      // Create a map for quick lookup of existing tickets by position
      const savedTicketMap = new Map<string, { color: string; price: string }>()
      savedTicket.forEach((data) => {
        savedTicketMap.set(data.label, { color: data.color, price: data.price })
      })

      // Positions in the new ticket info
      const ticketLabels = new Set(
        ticketInfo.map((ticket) => ticket.ticketType)
      )

      // Prepare the result
      const tickets = []
      for (const [label, { color, price }] of savedTicketMap) {
        if (ticketLabels.has(label)) {
          tickets.push({ label, color, price })
        }
      }

      return tickets
    }),

  bookTicket: protectedProcedure
    .input(z.object({ position: z.number().array(), eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      input.position.map(async (position) => {
        await ctx.db.ticket.updateMany({
          where: {
            AND: [
              {
                position: Number(position),
              },
              {
                eventId: input.eventId,
              },
            ],
          },
          data: {
            isBooked: true,
            bookedByID: userId,
          },
        })
      })
    }),

  bookTicketByForm: protectedProcedure
    .input(
      z.object({
        seats: z.number(),
        id: z.number(),
        ticketType: z.string(),
        price: z.number(),
        eventId: z.number(),
        color: z.string(),
        totalSeats: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const ticketId = []

      for (let i = 0; i < input.seats; i++) {
        const ticket = await ctx.db.ticket.create({
          data: {
            eventId: input.eventId,
            label: input.ticketType,
            price: input.price.toString(),
            color: input.color,
            isBooked: true,
            bookedByID: userId,
          },
        })
        ticketId.push(ticket.id)
      }

      await ctx.db.ticketInfo.update({
        where: {
          id: input.id,
        },
        data: {
          totalSeats: input.totalSeats - input.seats,
        },
      })

      return ticketId
    }),

  getBookedTickets: protectedProcedure.query(async ({ ctx }) => {
    const eventId = ctx.currentEvent
    return await ctx.db.ticket.findMany({
      where: {
        AND: [
          {
            eventId: eventId!,
          },
          {
            isBooked: true,
          },
        ],
      },
      include: {
        user: true,
        event: true,
      },
    })
  }),
  selectTicket: protectedProcedure
    .input(z.object({ position: z.string().array(), eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // const userId=ctx.session.user.id
      input.position.map(async (position) => {
        await ctx.db.ticket.updateMany({
          where: {
            AND: [
              {
                position: Number(position),
              },
              {
                eventId: input.eventId,
              },
            ],
          },
          data: {
            isSelectedByUser: true,
          },
        })
      })
    }),
  deSelectTicket: protectedProcedure
    .input(z.object({ position: z.string().array(), eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // const userId=ctx.session.user.id

      input.position.map(async (position) => {
        await ctx.db.ticket.updateMany({
          where: {
            AND: [
              {
                position: Number(position),
              },
              {
                eventId: input.eventId,
              },
            ],
          },
          data: {
            isSelectedByUser: false,
          },
        })
      })
    }),
  bookingUserInfo: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        phoneNumber: z.number(),
        position: z.number().array(),
        eventId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // console.log(input.position)
      // const ticketId: number[] = []
      input.position.map(async (p) => {
        const ticket = await ctx.db.ticket.findFirst({
          where: {
            AND: [
              {
                position: Number(p),
              },
              {
                eventId: input.eventId,
              },
            ],
          },
        })

        await ctx.db.bookingUserInfo.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phoneNumber.toString(),
            ticketId: Number(ticket?.id),
          },
        })
      })
    }),

  bookingUserByFormInfo: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        phoneNumber: z.number(),
        ids: z.number().array(),
        eventId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // console.log(input.position)
      // const ticketId: number[] = []
      input.ids.map(async (id) => {
        // const ticket = await ctx.db.ticket.findFirst({
        //   where: {
        //     AND: [
        //       {
        //         position: Number(p),
        //       },
        //       {
        //         eventId: input.eventId,
        //       },
        //     ],
        //   },
        // })

        await ctx.db.bookingUserInfo.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phoneNumber.toString(),
            ticketId: id,
          },
        })
      })
    }),

  getTicketCount: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { eventId } = input

      const bookedTickets = await ctx.db.ticket.count({
        where: {
          eventId: eventId,
        },
      })
      return bookedTickets
    }),

  getTicketSaleDate: protectedProcedure.query(({ ctx }) => {
    const eventId = ctx.currentEvent
    if (!eventId) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Event doesnot exist",
      })
    }

    const sales = ctx.db.bookingUserInfo.findMany({
      where: {
        ticket: {
          eventId: eventId,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      distinct: "createdAt",
    })
    return sales
  }),
})
