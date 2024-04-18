"use client"

import { useState } from "react"
import { type ChatGroup } from "@prisma/client"
import { api } from "~/trpc/react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

export default function Chats() {
  const [value, setValue] = useState("")
  const [group, setGroup] = useState<ChatGroup | null>(null)

  const createGroup = api.chat.create.useMutation({
    // onSuccess(data) {
    //   console.log({ data })
    // },
    onError(error) {
      console.log({ error })
    },
  })

  api.chat.getLatest.useSubscription(undefined, {
    onData(data) {
      setGroup(data)
    },
    onError(err) {
      console.log({ "public-err": err })
    },
  })

  return (
    <div className="container mt-20">
      <div>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target?.value)
          }}
        />
        <Button
          onClick={() => {
            createGroup.mutate({
              name: value,
            })
          }}
        >
          Create Group
        </Button>
      </div>
      <div>Latest Post: {group?.name} </div>
    </div>
  )
}
