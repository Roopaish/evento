import { type Post } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import { Events } from "~/constants/events"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { ee } from "~/trpc/shared"
import { z } from "zod"

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      }
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      })

      // Emit event when a post is created so that event in getLatest function is triggered
      ee.emit(Events.LATEST_POST, post)
      return post
    }),

  getLatest: publicProcedure.subscription(({ ctx }) => {
    return observable<Post>((emit) => {
      const onAdd = (data: Post) => {
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!"
  }),

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random())
      }, 2000)
      return () => {
        clearInterval(int)
      }
    })
  }),

  randomPrivateNumber: protectedProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random())
      }, 2000)
      return () => {
        clearInterval(int)
      }
    })
  }),
})
