import { postRouter } from "~/server/api/routers/post"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

import { chatRouter } from "./routers/chat"
import { eventRouter } from "./routers/event"
import { kanbanRouter } from "./routers/kanban"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => "server is running!"),

  post: postRouter,
  event: eventRouter,
  chat: chatRouter,
  kanban: kanbanRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
