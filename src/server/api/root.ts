import fs from "fs"
import path from "path"
import { postRouter } from "@/server/api/routers/post"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { Parser } from "@json2csv/plainjs"

import { assetRouter } from "./routers/asset"
import { chatRouter } from "./routers/chat"
import { eventRouter } from "./routers/event"
import { invitationRouter } from "./routers/invitations"
import { jobRouter } from "./routers/job"
import { kanbanRouter } from "./routers/kanban"
import { marketingRouter } from "./routers/marketing"
import { subdomainRouter } from "./routers/subdomain"
import { ticketRouter } from "./routers/tickets"
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
  subdomain: subdomainRouter,
  marketing: marketingRouter,
  ticket: ticketRouter,

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

      // const directoryPath = path.join(__dirname, "src", "server", "csv") // at compile time __dirname join as .next directory
      const directoryPath = path.join("src", "server", "csv")
      const filePath = path.join(directoryPath, "events.csv")

      try {
        // Ensure the directory exists
        fs.mkdir(directoryPath, { recursive: true }, (err) => {
          if (err) {
            return console.error(err)
          }

          fs.writeFile(filePath, csvData, (err) => {
            if (err) {
              console.error(err)
              return
            }
            console.log("Csv File was written successfully")
          })
        })
      } catch (error) {
        console.error(error)
        return error
      }

      return { message: "Csv File was written successfully" }
    } catch (error) {
      console.error(error)
      return error
    }
  }),
})

// export type definition of API
export type AppRouter = typeof appRouter
