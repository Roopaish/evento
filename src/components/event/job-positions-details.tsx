"use client"

import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { cn } from "@/lib/utils"
import { jobApplicationSchemaClient } from "@/lib/validations/job-application-validation-client"

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
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Text } from "../ui/text"

const JobApplicationForm = ({ id }: { id: number }) => {
  const form = useForm<z.infer<typeof jobApplicationSchemaClient>>({
    resolver: zodResolver(jobApplicationSchemaClient),
    defaultValues: {},
  })

  const { mutate, isLoading } = api.jobs.addApplication.useMutation({})

  function onSubmit(values: z.infer<typeof jobApplicationSchemaClient>) {
    mutate({ ...values, jobPositionId: id })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="cv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cv</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormDescription>Add Cv</FormDescription>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        ></FormField>

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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default function JobPositionsDetail({
  jobPositions,
}: {
  jobPositions: RouterOutputs["event"]["getEvent"]["jobPositions"]
}) {
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
            <Dialog>
              <DialogTrigger>
                <Button>Apply</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for {item.title}</DialogTitle>
                  <DialogDescription>
                    <JobApplicationForm id={item.id}></JobApplicationForm>
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
