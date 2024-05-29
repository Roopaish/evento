import { revalidatePath } from "next/cache"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { ee } from "@/trpc/shared"
import { type ChatMessage, type User } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import { z } from "zod"

interface ChatMessageProps extends ChatMessage {
  user: User
}

export const chatRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.db.chatGroup.create({
        data: {
          eventId: input.eventId,
        },
      })
      // Emit event when a post is created so that event in getLatest function is triggered
      // ee.emit(Events.LATEST_POST, group)
      revalidatePath("/dashboard/chats")
      return group
    }),

  sendMessage: protectedProcedure
    .input(z.object({ message: z.string(), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.chatMessage.create({
        data: {
          message: input.message,
          userId: ctx.session.user.id,
          chatGroupId: input.id,
        },
        include: {
          user: true,
        },
      })

      await ctx.db.chatGroup.update({
        where: {
          id: input.id,
        },
        data: {
          latestMessageId: message.id,
        },
      })

      ee.emit("send-message", message)
      return message
    }),

  getLatestMsg: protectedProcedure.subscription(() => {
    return observable<ChatMessageProps>((emit) => {
      const onMsg = (message: ChatMessageProps) => {
        emit.next(message)
      }
      ee.on("send-message", onMsg)
      return () => {
        ee.off("send-message", onMsg)
      }
    })
  }),

  findAllMessage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const chatMessage = await ctx.db.chatMessage.findMany({
        where: {
          chatGroupId: input.id,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
      return chatMessage
    }),

  findGroupByEventId: protectedProcedure.query(async ({ ctx, input }) => {
    const eventId = ctx.currentEvent
    const group = await ctx.db.chatGroup.findUnique({
      where: {
        eventId: Number(eventId!),
      },
      include: {
        event: true,
      },
    })
    return group
  }),

  seenBy: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const chatMessages = await ctx.db.chatMessage.findMany({
        where: {
          chatGroupId: input.id,
        },
      })

      // Get the current user ID
      const userId = ctx.session.user.id

      // Update the seenBy field for each chat message
      for (const message of chatMessages) {
        await ctx.db.chatMessage.update({
          where: {
            id: message.id,
          },
          data: {
            seenBy: {
              connect: {
                id: userId,
              },
            },
          },
        })
      }
    }),
})
