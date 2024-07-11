import fs from "fs"
import { postRouter } from "@/server/api/routers/post"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { Parser } from "@json2csv/plainjs"

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

  // ${API_URL}/api/trpc/exportEvents
  exportEvents: publicProcedure.query(async ({ ctx }) => {
    try {
      const eventDatas = await ctx.db.event.findMany({
        select: {
          id: true,
          createdById: true,
          title: true,
          type: true,
          category: true,
          date: true,
          address: true,
        },
      })
      const fields = [
        "id",
        "createdById",
        "title",
        "type",
        "category",
        "date",
        "address",
      ]
      const json2csvParser = new Parser({ fields })
      const csvData = json2csvParser.parse(eventDatas)
      // console.log("csvData", csvData)

      fs.writeFile("src/server/csv/events.csv", csvData, (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log("File has been created")
      })

      return { message: "File has been created" }
    } catch (error) {
      console.error(error)
      return error
    }
  }),
})

// export type definition of API
export type AppRouter = typeof appRouter
