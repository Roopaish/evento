import { type ChatMessage } from "@prisma/client"
import { observable } from "@trpc/server/observable"
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
      // Emit event when a post is created so that event in getLatest function is triggered
      // ee.emit(Events.LATEST_POST, group)
      return group
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.chatGroup.findMany()
    return data
  }),

  sendMessage: protectedProcedure
    .input(z.object({ message: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.chatMessage.create({
        data: {
          message: input.message,
          createdById: ctx.session.user.id,
          chatGroupId: input.id,
        },
      })
      ee.emit("send-message", message)
      return message
    }),

  getLatestMsg: protectedProcedure.subscription(() => {
    return observable<ChatMessage>((emit) => {
      const onMsg = (message: ChatMessage) => {
        console.log("on-msg")
        emit.next(message)
      }
      ee.on("send-message", onMsg)
      return () => {
        ee.off("send-message", onMsg)
      }
    })
  }),

  findAllMessage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chatMessage = await ctx.db.chatMessage.findMany({
        where: {
          chatGroupId: input.id,
        },
      })
      return chatMessage
    }),
})
