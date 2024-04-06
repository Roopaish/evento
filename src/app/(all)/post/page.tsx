"use client"

import { useState } from "react"
import { type Post } from "@prisma/client"
import { api } from "~/trpc/react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

export default function TestPage() {
  const [value, setValue] = useState("")
  const [post, setPost] = useState<Post | null>(null)
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

  const { mutate } = api.post.create.useMutation({
    onSuccess(data) {
      console.log({ data })
    },
    onError(error) {
      console.log({ error })
    },
  })

  api.post.getLatest.useSubscription(undefined, {
    onData(data) {
      setPost(data)
    },
    onError(err) {
      console.log({ err })
    },
  })

  const { data } = api.post.hello.useQuery({
    text: "Something",
  })

  const { data: secret } = api.post.getSecretMessage.useQuery()
  return (
    <div>
      <div>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target?.value)
          }}
        />
        <Button
          onClick={() => {
            mutate({
              name: value,
            })
          }}
        >
          Create post
        </Button>
      </div>
      <div>Latest Post: {JSON.stringify(post)} </div>
      <div>Hello Data: {JSON.stringify(data)}</div>
      <div>
        Secret message: {secret ? JSON.stringify(secret) : "Login to see"}
      </div>
      <div>Random Number from websocket: {num}</div>
      <div>
        Protected Random Number from websocket:{" "}
        {privateNum ? privateNum : "Login to see"}
      </div>
    </div>
  )
}
