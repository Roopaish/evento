"use client"

import { redirect } from "next/navigation"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Session } from "next-auth"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { editProfileFormSchema } from "@/lib/validations/edit-profile-validation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Textarea } from "../ui/textarea"

export default function ProfileForm({ session }: { session: Session | null }) {
  const form = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {},
  })

  const editMutation = api.user.editProfile.useMutation()

  const onSubmit = async (values: z.infer<typeof editProfileFormSchema>) => {
    // console.log("Form values", values)
    if (!session?.user) {
      redirect("/")
    }
    const result = await editMutation.mutateAsync(values)
    if (result) {
      alert("Profile updated successfully")
      form.reset()
      // redirect("/dashboard/profile")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type your Location</FormLabel>
              <FormControl>
                <Input placeholder="Kathmandu,Nepal" {...field} />
              </FormControl>
              <FormDescription>
                The location above will influence your time zone for event
                times, unless you change it on the account management page
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  )
}
