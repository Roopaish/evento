"use client"

import { api } from "~/trpc/react"

export default function Chats() {
  const group = api.chat.find.useQuery()

  return (
    <div className="container mt-20">
      <div>
        {/* <Input
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
        </Button> */}
      </div>
      <div>
        {group?.data?.map((chat) => <h1 key={chat.id}>{chat.name}</h1>)}
      </div>
    </div>
  )
}
