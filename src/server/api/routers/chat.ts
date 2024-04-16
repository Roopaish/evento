import { type ChatGroup } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { ee } from "~/trpc/shared"

import { chatGroupSchema } from "~/lib/validations/chatGroupSchema"

export const chatRouter = createTRPCRouter({
  onAdd: publicProcedure.subscription(() => {
    // return an `observable` with a callback which is triggered immediately
    return observable<ChatGroup>((emit) => {
      const onAdd = (data: ChatGroup) => {
        // emit data to client
        emit.next(data)
      }

      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("add", onAdd)

      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("add", onAdd)
      }
    })
  }),
  add: protectedProcedure.input(chatGroupSchema).mutation(({ ctx, input }) => {
    const group = ctx.db.chatGroup.create({
      data: {
        name: input.name,
        userId: ctx.session.user.id,
      },
    })
    ee.emit("add", group)
    return group
  }),
})
