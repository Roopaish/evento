import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const ticketRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        grid: z.number(),
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
      const savedData = await ctx.db.ticket.findMany({
        where: {
          eventId: input.eventId,
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
          if (existingTicket.grid !== input.grid) {
            updates.grid = input.grid
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
              eventId: input.eventId,
              grid: input.grid,
              position: Number(ticket.position), // Position as number
              label: ticket.label,
              price: ticket.price.toString(),
              color: ticket.color,
            },
          })
        }
      }

      // Delete tickets that are not in the new ticket info
      for (const [position, data] of savedDataMap) {
        if (!newPositions.has(position.toString())) {
          await ctx.db.ticket.delete({
            where: { id: data.id },
          })
        }
      }
    }),
  getTicketByEventId: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ticket.findMany({
        where: {
          eventId: input.eventId,
        },
      })
    }),
})
