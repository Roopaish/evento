"use client"

import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { EventType } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { eventFormSchema } from "@/lib/validations/event-form-validation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AddEvent() {
  const router = useRouter()

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {},
  })

  const { mutate, isLoading } = api.event.addEvent.useMutation({
    onSuccess: () => {
      toast.success("Event has been created")
      router.push("/dashboard/events")
    },
    onError: (e) => {
      toast.error(e.message ?? "Something went wrong")
    },
  })

  function onSubmit(values: z.infer<typeof eventFormSchema>) {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Event Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as never as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(EventType).map((type, index) => (
                      <SelectItem value={type} key={index}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem style={{ flex: "60%" }}>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value as never as string}
                  type="datetime-local"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Capacity</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Instruction</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="images"
          render={({ field: { onChange }, ...field }) => {
            return (
              <FormItem>
                <FormLabel> Event Images</FormLabel>
                <FormControl>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {images &&
                      Array.from(images).map((image, index) => (
                        <figure
                          key={index}
                          className="relative h-40 w-40 overflow-hidden rounded-sm border-2 border-primary"
                        >
                          <Button
                            className="absolute right-2 top-2 "
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              const newImages = Array.from(images).filter(
                                (a, i) => i !== index
                              )
                              const dataTransfer = new DataTransfer()

                              if (newImages) {
                                Array.from(newImages).forEach((image) =>
                                  dataTransfer.items.add(image)
                                )
                              }

                              const newFiles = dataTransfer.files
                              onChange(newFiles)
                            }}
                          >
                            <Icons.Trash className="h-4 w-4" />
                          </Button>
                        
                          <img
                            width={160}
                            height={160}
                            className="h-full w-full object-cover"
                            src={URL.createObjectURL(image)}
                            alt={"image"}
                          />
                        </figure>
                      ))}

                    <div
                      onClick={() => {
                        ref.current?.click()
                      }}
                      className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center space-y-2 overflow-hidden rounded-sm border-2 border-primary"
                    >
                      <Icons.PlusSquare className="h-8 w-8" />
                      <Label>Add images</Label>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple={true}
                      disabled={form.formState.isSubmitting}
                      {...field}
                      ref={ref}
                      onChange={(event) => {
                        const dataTransfer = new DataTransfer()

                        if (images) {
                          Array.from(images).forEach((image) =>
                            dataTransfer.items.add(image)
                          )
                        }

                        Array.from(event.target.files!).forEach((image) =>
                          dataTransfer.items.add(image)
                        )

                        const newFiles = dataTransfer.files
                        onChange(newFiles)
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        */}

        <Button type="submit">
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  )
}
