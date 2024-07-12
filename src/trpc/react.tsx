"use client"

import { useState } from "react"
import { type AppRouter } from "@/server/api/root"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createWSClient,
  loggerLink,
  splitLink,
  unstable_httpBatchStreamLink,
  wsLink,
} from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"

import { env } from "@/env"

import { getUrl, transformer } from "./shared"

export const api = createTRPCReact<AppRouter>()

export function TRPCReactProvider(props: {
  children: React.ReactNode
  cookies: string
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // unstable_httpBatchStreamLink({
        //   url: getUrl(),
        //   headers() {
        //     return {
        //       cookie: props.cookies,
        //       "x-trpc-source": "react",
        //     }
        //   },
        // }),
        wsLink({
          client: createWSClient({
            url: env.NEXT_PUBLIC_WS_URL,
          }),
        }),
        splitLink({
          condition: (op) => op.type === "subscription",
          false: unstable_httpBatchStreamLink({
            url: getUrl(),
            headers() {
              return {
                cookie: props.cookies,
                "x-trpc-source": "react",
              }
            },
          }),
          true: wsLink({
            client: createWSClient({
              url: env.NEXT_PUBLIC_WS_URL,
            }),
          }),
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}
