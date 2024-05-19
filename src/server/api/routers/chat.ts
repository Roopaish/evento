import { revalidatePath } from "next/cache"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { ee } from "@/trpc/shared"
import { type ChatMessage } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import { z } from "zod"

interface ChatMessageProps extends ChatMessage {
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

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
      revalidatePath("/dashboard/chats")
      return group
    }),

  sendMessage: protectedProcedure
    .input(z.object({ message: z.string(), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.chatMessage.create({
        data: {
          message: input.message,
          createdById: ctx.session.user.id,
          createdByName: ctx.session.user.name!,
          chatGroupId: input.id,
        },
        select: {
          id: true,
          message: true,
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
          createdAt: true,
          createdById: true,
          createdByName: true,
          chatGroupId: true,
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
        select: {
          id: true,
          message: true,
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
          createdAt: true,
          createdById: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
      return chatMessage
    }),

  allGroups: protectedProcedure.query(async ({ ctx }) => {
    const groups = await ctx.db.chatGroup.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        chatMessage: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            id: "desc",
          },
        },
      },
    })

    return groups
  }),
})
