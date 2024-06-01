"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { uploadFiles } from "@/lib/requests/upload-file"
import { jobApplicationSchemaClient } from "@/lib/validations/job-application-validation-client"

import AssetUploader from "../assets/assets-uploader"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Text } from "../ui/text"
import { Textarea } from "../ui/textarea"

const JobApplicationForm = ({
  id,
  onCancel,
}: {
  id: number
  onCancel?: () => void
}) => {
  const form = useForm<z.infer<typeof jobApplicationSchemaClient>>({
    resolver: zodResolver(jobApplicationSchemaClient),
    defaultValues: {},
  })

  const { mutate, isLoading } = api.jobs.addApplication.useMutation({
    onSuccess: () => {
      toast.success("Applied Successfully")
      onCancel?.()
    },
  })

  const { mutateAsync: uploadAssets, isLoading: isUploading } = useMutation({
    mutationFn: (files: File[] | FileList) => uploadFiles(files),
    onSuccess: (data) => {
      // toast.success("Images uploaded successfully!")
      // form.reset()
      console.log({ successData: data })
    },
    onError: () => {
      toast.error("Failed to upload images!")
    },
  })

  async function onSubmit(values: z.infer<typeof jobApplicationSchemaClient>) {
    // Upload Manager Image
    let cv: { url: string; id: string } | undefined = undefined
    if (values.cv) {
      const { data: uploadedAsset } = await uploadAssets(values.cv)

      cv = {
        id: uploadedAsset?.images[0]?.fileId as unknown as string,
        url: uploadedAsset.images[0]?.url as unknown as string,
      }
    }

    if (!cv) {
      toast.error("Failed to upload cv")
      return
    }

    mutate({ ...values, jobPositionId: id, cv })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AssetUploader name={"cv"} title={"Add CV"} form={form} max={1} />

        <FormField
          control={form.control}
          name="pan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pan No.</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        ></FormField>
        <Button type="submit">
          {(isLoading || isUploading) && (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default function JobPositionsDetail({
  jobPositions,
  isCreatedByMe,
}: {
  jobPositions: RouterOutputs["event"]["getEvent"]["jobPositions"]
  isCreatedByMe: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="rounded-2xl bg-background px-6 py-8 shadow-container">
      <Text variant={"h6"} semibold>
        Open Job Positions
      </Text>

      <div className="mt-4 flex flex-col space-y-4">
        {jobPositions.map((item) => (
          <div className="flex flex-col justify-between gap-4 rounded-sm py-3 transition-all hover:bg-primary-50 hover:px-2 sm:flex-row sm:items-center">
            <div className="flex flex-col" key={item.id}>
              <div>
                <Text variant={"medium"} className="mb-2" medium>
                  {item.title}
                </Text>
                <Text variant={"small"}>{item.description}</Text>
              </div>
              <div className={" flex  items-center space-x-4 "}>
                <Text>Salary:&nbsp;{item.salary}</Text>
                <Separator orientation="vertical" className="h-5"></Separator>
                <Text>No. of Employee:&nbsp;{item.salary}</Text>
              </div>
            </div>

            {!isCreatedByMe && (
              <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <DialogTrigger>
                  <Button className="w-full sm:w-auto">Apply</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for {item.title}</DialogTitle>
                    <DialogDescription>
                      {session?.data?.user ? (
                        <JobApplicationForm
                          id={item.id}
                          onCancel={() => setIsOpen(false)}
                        ></JobApplicationForm>
                      ) : (
                        <div>
                          <Text>
                            You need to be logged in to apply for this job.
                          </Text>
                          <Button
                            onClick={() => {
                              router.push(`/login?next=${pathname}`)
                            }}
                          >
                            Go to Login
                          </Button>
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
