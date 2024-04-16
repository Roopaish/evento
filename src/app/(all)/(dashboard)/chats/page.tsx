"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ChatGroup } from "@prisma/client"
import { api } from "~/trpc/react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { chatGroupSchema } from "~/lib/validations/chatGroupSchema"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Icons } from "~/components/ui/icons"
import { Input } from "~/components/ui/input"

export default function ChatPage() {
  const [group, setGroup] = useState<ChatGroup | null>(null)

  const form = useForm<z.infer<typeof chatGroupSchema>>({
    resolver: zodResolver(chatGroupSchema),
    defaultValues: {},
  })
  const { mutate, isLoading } = api.chat.add.useMutation({
    onSuccess: () => {
      console.log("created")
    },
    onError: () => {
      console.log("error")
    },
  })

  api.chat.onAdd.useSubscription(undefined, {
    onData(data) {
      console.log(data)
      setGroup(data)
    },
    onError(err) {
      console.log({ err })
    },
  })

  function onSubmit(values: z.infer<typeof chatGroupSchema>) {
    mutate(values)
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel> chat group mame</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
      <div>latest group:{JSON.stringify(group)}</div>
    </>
  )
}
