import { clearInterval } from "timers"
import { observable } from "@trpc/server/observable"

import { eventFormSchema } from "~/lib/validations/event-form-validation"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const eventRouter = createTRPCRouter({
  addEvent: protectedProcedure
    .input(eventFormSchema)
    .mutation(({ input, ctx }) => {
      const { images, staffs, location, ...rest } = input

      return ctx.db.event.create({
        data: {
          ...rest,
          address: input.location.address,
          userId: ctx.session.user.id,
        },
      })
    }),

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random())
      }, 500)
      return () => {
        clearInterval(int)
      }
    })
  }),
})
