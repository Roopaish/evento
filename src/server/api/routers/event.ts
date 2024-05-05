import { type Event } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import { ee } from "~/trpc/shared"

import { eventFormSchema } from "~/lib/validations/event-form-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const eventRouter = createTRPCRouter({
  addEvent: protectedProcedure
    .input(eventFormSchema)
    .mutation(({ input, ctx }) => {
      const { staffs, location, ...rest } = input

      const event = ctx.db.event.create({
        data: {
          ...rest,
          address: location.address,
          userId: ctx.session.user.id,
        },
      })
      return event
    }),
})
