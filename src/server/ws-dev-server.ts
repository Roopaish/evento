import { applyWSSHandler } from "@trpc/server/adapters/ws"
import { getSession } from "next-auth/react"
import { WebSocketServer } from "ws"

import { appRouter } from "./api/root"

const wss = new WebSocketServer({
  port: Number(process.env.WS_PORT ?? "3001"),
})

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  // @ts-expect-error No need to pass db
  createContext: async ({ req, res, ...rest }) => {
    let session = null

    try {
      session = await getSession({ req })
    } catch (e) {
      // console.log(e)
    }

    return { ...rest, req, res, session }
  },
  onError: () => {
    console.log("error")
  },
})

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`)
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`)
  })
})
console.log("✅ WebSocket Server listening on ws://localhost:3001")

process.on("SIGTERM", () => {
  console.log("SIGTERM")
  handler.broadcastReconnectNotification()
  wss.close()
})
