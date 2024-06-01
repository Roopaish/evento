"use client"

import { useState } from "react"
import { api } from "@/trpc/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Icons } from "../ui/icons"
import { InputTags } from "../ui/input-tags"

export default function InviteMembersButton({ eventId }: { eventId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<{ emails: string[] }>()

  const { mutateAsync, isLoading } = api.invitation.invite.useMutation({
    onError(error) {
      toast.error(error.message)
    },
    onSuccess() {
      toast.success("Invitation sent")
      form.reset()
      setIsOpen(false)
    },
  })

  function onSubmit(values: { emails: string[] }) {
    void mutateAsync({
      eventId: Number(eventId),
      emails: values.emails,
    })
  }

  const emails = form.watch("emails") ?? []

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger className="w-full">
          <Button className="w-full">Invite Members</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite members through email</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="emails"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputTags
                              {...field}
                              placeholder="Enter email address"
                              errorMessage="Invalid email address"
                              validation={(value) => {
                                return z.string().email().safeParse(value)
                                  .success
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {emails.length > 0 && (
                      <Button type="submit" className="w-full">
                        {isLoading && (
                          <Icons.spinner className="animate-spin" />
                        )}
                        Send Invitation
                      </Button>
                    )}
                  </form>
                </Form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
