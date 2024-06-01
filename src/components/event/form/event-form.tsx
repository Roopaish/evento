"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { EventType } from "@prisma/client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { uploadFiles } from "@/lib/requests/upload-file"
import { cn } from "@/lib/utils"
import { eventFormSchemaClient } from "@/lib/validations/event-form-validation-client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import AssetUploader from "@/components/assets/assets-uploader"

export default function EventForm({ id }: { id?: number }) {
  const isEdit = !!id

  const router = useRouter()

  const form = useForm<z.infer<typeof eventFormSchemaClient>>({
    resolver: zodResolver(eventFormSchemaClient),
    defaultValues: {},
  })

  const { fields, append, remove } = useFieldArray({
    name: "jobPositions",
    control: form.control,
  })

  const { data: previousData } = api.event.getMyEvent.useQuery(
    {
      id: id!,
    },
    {
      enabled: isEdit,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )

  useEffect(() => {
    if (!!previousData) {
      const cleanedRest = Object.fromEntries(
        Object.entries(previousData).map(([key, value]) => [
          key,
          value === "" ? null : key === "managerImage" ? [value] : value,
        ])
      )

      form.reset(cleanedRest)
    }
  }, [previousData])

  const { mutate, isLoading } = api.event.addEvent.useMutation({
    onSuccess: (data) => {
      toast.success("Event has been created")
      router.push(`/events/${data.id}`)
    },
    onError: (e) => {
      toast.error(e.message ?? "Something went wrong")
    },
  })

  const { mutate: update, isLoading: isUpdating } =
    api.event.editEvent.useMutation({
      onSuccess: (data) => {
        toast.success("Event has been updated")
        router.push(`/events/${data.id}`)
      },
      onError: (e) => {
        toast.error(e.message ?? "Something went wrong")
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

  const { mutateAsync: deleteAsset, isLoading: isDeleting } =
    api.asset.delete.useMutation({
      onSuccess: () => {
        toast.success("Images deleted successfully!")
      },
      onError: () => {
        toast.error("Failed to delete images!")
      },
    })

  async function onSubmit(values: z.infer<typeof eventFormSchemaClient>) {
    // Upload Cover Images
    const assetsToUpload = Array.from(values.assets).filter(
      (asset) => !("url" in asset)
    )
    const assets: { url: string; id: string }[] = []

    if (assetsToUpload.length) {
      const { data: uploadedAssets } = await uploadAssets(assetsToUpload)
      console.log({ uploadedAssets })
      if (uploadedAssets?.images) {
        assets.push(
          ...uploadedAssets?.images?.map((a) => {
            return {
              url: a.url,
              id: a.fileId,
            }
          })
        )
      }
    }

    const assetsToDelete =
      previousData?.assets?.filter(
        (image) =>
          !Array.from(values.assets)?.some((i) =>
            "id" in i ? i.id === image.id : false
          )
      ) ?? []

    if (assetsToDelete.length) {
      await deleteAsset({ ids: assetsToDelete.map((a) => a.id) })
    }

    // Upload Manager Image
    let managerImage: { url: string; id: string } | undefined = undefined
    if (
      values.managerImage &&
      Array.from(values.managerImage).some((asset) => !("url" in asset))
    ) {
      const { data: uploadedAsset } = await uploadAssets(values.managerImage)

      managerImage = {
        id: uploadedAsset?.images[0]?.fileId as unknown as string,
        url: uploadedAsset.images[0]?.url as unknown as string,
      }
    }

    if (isEdit) {
      update({ ...values, id, assets, managerImage })
    } else {
      mutate({ ...values, assets, managerImage })
    }
  }

  return (
    <Form {...form}>
      <Text variant={"h5"} semibold className="mb-4 mt-5 text-center">
        {isEdit ? "Edit event" : "Create new event"}
      </Text>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 rounded-2xl bg-background px-6 py-8 shadow-container transition-all"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
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
              <FormItem className="">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value as never as string}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Select event type"
                          className="w-full"
                        />
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
              <FormItem>
                <FormLabel>Date</FormLabel>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start pl-3 text-left font-normal hover:scale-100 focus:scale-100",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 opacity-50" />

                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-white p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Description</FormLabel>
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
              <FormLabel>Instruction</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1  gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="managerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="managerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <AssetUploader
          name={"managerImage"}
          title="Manager Image"
          form={form}
          max={1}
        />

        <AssetUploader name={"assets"} title={"Images"} form={form} />

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="overflow-visible">
            <AccordionTrigger>
              Are your looking to hire somebody?
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-8">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-8 rounded-sm border p-4 md:grid-cols-2 lg:grid-cols-3"
                  >
                    <FormField
                      control={form.control}
                      name={`jobPositions.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`jobPositions.${index}.salary`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`jobPositions.${index}.noOfEmployees`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No of Employees needed</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`jobPositions.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant={"outline"}
                      className="mt-auto"
                      onClick={() => remove(index)}
                    >
                      <Icons.MinusCircle /> Delete Job Position
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                className="mt-4"
                onClick={() => {
                  append({
                    title: "",
                    description: "",
                    salary: 0,
                    noOfEmployees: 0,
                  })
                }}
                type="button"
                variant={"outline"}
              >
                <Icons.Plus />
                Add job position
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          type="submit"
          onClick={() => {
            const errors = form.formState.errors

            if (Object.keys(errors).length) {
              toast.error(
                Object.keys(errors)
                  .flatMap((p) => `${p}: ${errors[p as "title"]?.message}`)
                  .join(", ")
              )
              return
            }
          }}
        >
          {(isLoading || isUpdating || isDeleting || isUploading) && (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  )
}
