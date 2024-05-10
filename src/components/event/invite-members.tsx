"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { InputTags } from "../ui/input-tags"

export default function InviteMembersButton() {
  const form = useForm<{ emails: string[] }>()

  function onSubmit(values: { emails: string[] }) {
    console.log(values)
  }

  const emails = form.watch("emails")

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>Invite Members</Button>
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
