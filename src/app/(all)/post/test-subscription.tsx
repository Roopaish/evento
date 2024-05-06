"use client"

import { useState } from "react"
import { api } from "~/trpc/react"

import { Input } from "~/components/ui/input"

export default function TestSubscription() {
  const setMsg = api.post.setMsg.useMutation()
  const setProtectedMsg = api.post.setProtectedMsg.useMutation()
  const [publicMsg, setPublicMsg] = useState("")
  const [privateMsg, setPrivateMsg] = useState("")

  api.post.getMsg.useSubscription(undefined, {
    onData(data) {
      setPublicMsg(data)
    },
    onError(err) {
      console.log({ "public-err": err })
    },
  })

  api.post.getProtectedMsg.useSubscription(undefined, {
    onData(data) {
      setPrivateMsg(data)
    },
    onError(err) {
      console.log({ "protected-err": err })
    },
  })

  // Random numbers
  const [num, setNumber] = useState<number>()
  const [privateNum, setPrivateNumber] = useState<number>()

  api.post.randomNumber.useSubscription(undefined, {
    onData(n) {
      setNumber(n)
    },
  })

  api.post.randomPrivateNumber.useSubscription(undefined, {
    onData(n) {
      setPrivateNumber(n)
    },
  })

  return (
    <main className="my-20">
      <h1>Test Subscription</h1>
      <div className="rounded-md border p-4">
        Using Public Procedure
        <div className="my-2 flex gap-2">
          <Input
            placeholder="Add value and hit enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setMsg.mutate({ msg: e.currentTarget.value ?? "No value" })
              }
            }}
          />

          <h1>Msg: {publicMsg}</h1>
        </div>
        <div className="mb-4 mt-2 block">
          Log:
          {JSON.stringify(setMsg)}
        </div>
        Using Protected Procedure
        <div className="my-2 flex gap-2">
          <Input
            placeholder="Add value and hit enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setProtectedMsg.mutate({
                  msg: e.currentTarget.value ?? "No value",
                })
              }
            }}
          />

          <pre>Msg: {privateMsg}</pre>
        </div>
        <div className="mb-4 mt-2">
          Log:
          {JSON.stringify(setProtectedMsg)}
        </div>
      </div>

      <div className="rounded-md border p-4">
        <div>Random Number from websocket: {num}</div>
        <div>
          Protected Random Number from websocket:{" "}
          {privateNum ? privateNum : "Login to see"}
        </div>
      </div>
    </main>
  )
}
