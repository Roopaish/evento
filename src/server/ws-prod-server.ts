import type { Socket } from "net"
import { createServer } from "node:http"
import { parse } from "node:url"
import next from "next"
import { applyWSSHandler } from "@trpc/server/adapters/ws"
import { WebSocketServer } from "ws"

import { appRouter } from "./api/root"
import { createTRPCContext } from "./api/trpc"

const port = parseInt(process.env.PORT ?? "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

void app.prepare().then(() => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const server = createServer(async (req, res) => {
    if (!req.url) return
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  })
  const wss = new WebSocketServer({ server })
  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: createTRPCContext,
  })

  process.on("SIGTERM", () => {
    console.log("SIGTERM")
    handler.broadcastReconnectNotification()
  })

  server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket as Socket, head, (ws) => {
      wss.emit("connection", ws, req)
    })
  })

  // Keep the next.js upgrade handler from being added to our custom server
  // so sockets stay open even when not HMR.
  const originalOn = server.on.bind(server)
  server.on = function (event, listener) {
    return event !== "upgrade" ? originalOn(event, listener) : server
  }
  server.listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  )
})
