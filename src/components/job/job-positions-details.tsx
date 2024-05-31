"use client"

import { useState } from "react"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { uploadFiles } from "@/lib/requests/upload-file"
import { cn } from "@/lib/utils"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Text } from "../ui/text"

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
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormDescription>Add Pan no:</FormDescription>
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
                <Input {...field} />
              </FormControl>
              <FormDescription>Add Message</FormDescription>
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
}: {
  jobPositions: RouterOutputs["event"]["getEvent"]["jobPositions"]
}) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className={cn("container")}>
      <div className="flex flex-col border-2 py-2 ">
        {jobPositions.map((item) => (
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col" key={item.id}>
              <div className="border-b-2 border-primary-50 ">
                <Text variant={"h5"} className="mb-2">
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

            <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
              <DialogTrigger>
                <Button>Apply</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for {item.title}</DialogTitle>
                  <DialogDescription>
                    <JobApplicationForm
                      id={item.id}
                      onCancel={() => setIsOpen(false)}
                    ></JobApplicationForm>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  )
}
