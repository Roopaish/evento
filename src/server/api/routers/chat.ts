import { revalidatePath } from "next/cache"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { ee } from "@/trpc/shared"
import { type ChatMessage, type User } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import { z } from "zod"

interface ChatMessageProps extends ChatMessage {
  user: User
  seenBy: User[]
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

  getUserMessage: protectedProcedure
    .input(
      z.object({
        cursor: z.date().nullish(),
        take: z.number().min(1).max(50).nullish(),
        // id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const take = input.take ?? 20
      const cursor = input.cursor

      const eventId = ctx.currentEvent

      const chatGroup = await ctx.db.chatGroup.findUnique({
        where: {
          eventId: Number(eventId),
        },
      })

      const page = await ctx.db.chatMessage.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          chatGroupId: chatGroup!.id,
        },
        include: {
          user: true,
          seenBy: {
            where: {
              NOT: {
                id: ctx.session.user.id,
              },
            },
          },
        },
        cursor: cursor ? { createdAt: cursor } : undefined,
        take: take + 1,
        skip: 0,
      })

      const items = page.reverse()
      let nextCursor: typeof cursor | null = null
      if (items.length > take) {
        const prev = items.shift()
        nextCursor = prev!.createdAt
      }
      return {
        items,
        nextCursor,
      }
    }),

  findGroupByEventId: protectedProcedure.query(async ({ ctx }) => {
    const eventId = ctx.currentEvent
    const group = await ctx.db.chatGroup.findUnique({
      where: {
        eventId: Number(eventId!),
      },
      include: {
        event: {
          include: {
            participants: true,
            createdBy: true,
          },
        },
      },
    })
    return group
  }),

  seenBy: protectedProcedure.mutation(async ({ ctx }) => {
    // Get the current user ID
    const userId = ctx.session?.user?.id
    const eventId = ctx.currentEvent

    const chatGroup = await ctx.db.chatGroup.findUnique({
      where: {
        eventId: Number(eventId),
      },
    })

    const chatMessages = await ctx.db.chatMessage.findMany({
      where: {
        chatGroupId: chatGroup!.id,
        NOT: {
          userId: userId,
        },
      },
    })

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
