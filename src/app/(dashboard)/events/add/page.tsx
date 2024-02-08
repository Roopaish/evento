"use client"

import { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"

enum EventType {
  WEDDING = "WEDDING",
  CONFERENCE = "CONFERENCE",
  SEMINAR = "SEMINAR",
  WORKSHOP = "WORKSHOP",
  PARTY = "PARTY",
  OTHER = "OTHER",
}
const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

const formSchema = z.object({
  title: z.string().min(4).max(50),
  type: z.nativeEnum(EventType),
  date: z.coerce.date(),
  location: z.object({ address: z.string(), lat: z.string(), lng: z.string() }),
  capacity: z.coerce.number().min(0),
  description: z.string().min(80),
  staffs: z.array(z.string().email()).optional(),
  instruction: z.string().optional(),
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    ),
})

export default function AddEvent() {
  const ref = useRef<HTMLInputElement | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const images = form.watch("images")

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
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
            <div style={{ display: "flex", gap: "10px" }}>
              <FormItem style={{ flex: "60%" }}>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value as never as string}
                    type="date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem style={{ flex: "40%" }}>
                <FormLabel>Starts at</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value as never as string}
                    type="time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
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

        <FormField
          control={form.control}
          name="images"
          render={({ field: { onChange }, ...field }) => {
            return (
              <FormItem>
                <FormLabel> Event Images</FormLabel>
                {/* File Upload */}
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
