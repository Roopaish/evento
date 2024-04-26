import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { ee } from "~/trpc/shared"
import { z } from "zod"

export const chatRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.db.chatGroup.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      })
      // Emit event when a post is created so that event in getLatest function is triggered
      // ee.emit(Events.LATEST_POST, group)
      return group
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.chatGroup.findMany()
    return data
  }),
})
