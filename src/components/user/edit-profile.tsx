"use client"

import { useEffect } from "react"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Session } from "next-auth"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  editProfileFormSchema,
  type EditProfileForm,
} from "@/lib/validations/edit-profile-validation"
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
  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {},
  })

  // const { data: user } = api.user.getUser.useQuery()

  const utils = api.useUtils()

  const editMutation = api.user.editProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile has been edited.")
      void utils.user.getUser.refetch() // <= here
    },
    onError: (e) => {
      toast.error("Failed to edit Profile.", {
        description: e.message,
      })
    },
  })

  const onSubmit = (values: EditProfileForm) => {
    editMutation.mutate(values)
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        name: "",
        address: "",
        bio: "",
      })
    }
  }, [form.formState])

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
