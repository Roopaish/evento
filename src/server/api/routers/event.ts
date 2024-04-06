import { eventFormSchema } from "~/lib/validations/event-form-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

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
})
