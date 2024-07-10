import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "../trpc"

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
        savedDataMap.set(data.position, data)
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

  // bookTicketByEventId: protectedProcedure
  // .input(z.object({eventId:z.number()}))
  // .query(async ({ ctx,input}) => {

  // const label= await ctx.db.ticket.groupBy({
  //   by:['label'],
  //   where:{
  //     eventId:input.eventId
  //   },
  // })

  // const ticket= await ctx.db.ticket.findMany({
  //   where: {
  //     eventId:input.eventId,
  //   }})

  //   return {label,ticket}

  // }),

  createTicketInfo: protectedProcedure
    .input(z.object({ type: z.string(), price: z.number(), color: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const eventId = ctx.currentEvent
      await ctx.db.ticketInfo.create({
        data: {
          eventId: eventId!,
          ticketType: input.type,
          price: input.price,
          color: input.color,
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
      console.log(input.position)
      const ticketId: number[] = []
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
        if (ticket) ticketId.push(ticket?.id)
      })
      ticketId.map(async (id) => {
        await ctx.db.bookingUserInfo.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phoneNumber,
            ticketId: id,
          },
        })
      })
    }),
})
