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
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { cn } from "@/lib/utils"
import { eventFormSchema } from "@/lib/validations/event-form-validation"
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

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {},
  })

  useEffect(() => {
    if (isEdit) {
      // form.formState
    }
  }, [isEdit])

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
        />

        <AssetUploader name={"assets"} title={"Images"} form={form} />

        <Button type="submit">
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  )
}
