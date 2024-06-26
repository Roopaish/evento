import { postRouter } from "@/server/api/routers/post"
import { createTRPCRouter } from "@/server/api/trpc"

import { assetRouter } from "./routers/asset"
import { chatRouter } from "./routers/chat"
import { eventRouter } from "./routers/event"
import { invitationRouter } from "./routers/invitations"
import { jobRouter } from "./routers/job"
import { kanbanRouter } from "./routers/kanban"
import { userRouter } from "./routers/user"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  event: eventRouter,
  chat: chatRouter,
  user: userRouter,
  jobs: jobRouter,
  kanban: kanbanRouter,
  asset: assetRouter,
  invitation: invitationRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
