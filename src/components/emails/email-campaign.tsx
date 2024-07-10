"use client"

import { useState } from "react"
import { useCurrentEventStore } from "@/store/current-event-store"
import { api } from "@/trpc/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { type InvitationSchema } from "@/lib/validations/invitation-validation"
import { Button } from "@/components/ui/button"

import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Icons } from "../ui/icons"
import { InputTags } from "../ui/input-tags"

export default function EmailsCampaign() {
  const {
    data: sentEmailData,
    isLoading: emailsLoading,
    refetch,
  } = api.marketing.getSentEmail.useQuery()
  console.log(sentEmailData)

  const { mutateAsync: sendMultipleEmails, isLoading: sendingEmails } =
    api.marketing.addMultipleEmail.useMutation({
      onSuccess() {
        toast.success("Emails Sent")
        form.reset()
        void refetch()
      },
      onError: (e) => {
        toast.error(e.message ?? "Something went Wrong")
      },
    })

  const form = useForm<{ emails: string[] }>()
  const emails = form.watch("emails") ?? []

  const handleSend = async (values: z.infer<typeof InvitationSchema>) => {
    await sendMultipleEmails({ ...values })
  }

  return (
    <>
      <div className="max-w-4xl p-4">
        <p className="mb-4 text-lg font-medium">
          Optimize Event Promotions with Smart Email Campaign Strategies
        </p>
        <div className="mb-8 flex items-center space-x-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSend)} className="">
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
                          return z.string().email().safeParse(value).success
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {emails.length > 0 && (
                <Button type="submit" className="w-full">
                  {sendingEmails && <Icons.spinner className="animate-spin" />}
                  Send Invitation
                </Button>
              )}
            </form>
          </Form>
        </div>

        <p className="m-4 text-lg font-semibold">Email Campaigns</p>
        {emailsLoading && <div>Loading Emails</div>}

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Email Address
                </th>
                <th className="bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Sent At
                </th>
              </tr>
            </thead>

            <tbody>
              {sentEmailData?.map((data) => (
                <tr key={data.id}>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {data.sendTo}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {data.createdAt.toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
