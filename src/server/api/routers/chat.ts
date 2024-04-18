import { type ChatGroup } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import { Events } from "~/constants/events"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
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
      console.log("create")
      // Emit event when a post is created so that event in getLatest function is triggered
      ee.emit(Events.LATEST_POST, group)
      return group
    }),

  getLatest: protectedProcedure.subscription(({ ctx }) => {
    return observable<ChatGroup>((emit) => {
      const onAdd = (data: ChatGroup) => {
        console.log("subs")
        emit.next(data)
      }
      // trigger `onAdd()` when `Events.LATEST_POST` is triggered in our event emitter
      ee.on(Events.LATEST_POST, onAdd)
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off(Events.LATEST_POST, onAdd)
      }
    })
  }),
})
