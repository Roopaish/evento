import { useEffect, useMemo, useState } from "react"
import { api } from "@/trpc/react"
import type { Task } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { TaskStatus } from "@prisma/client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { cn, getInitials } from "@/lib/utils"
import {
  taskFormSchema,
  type TaskFormSchema,
} from "@/lib/validations/task-form-validation"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/extension/multi-select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

export default function TaskForm({
  status,
  onCancel,
  task,
}: {
  status: TaskStatus
  onCancel: () => void
  task?: Task
}) {
  const taskFormValues: TaskFormSchema = task
    ? {
        title: task?.title ?? "",
        description: task?.description ?? "",
        dueDate: task?.dueDate ?? undefined,
        assignedTo:
          task?.assignedTo.length > 0
            ? task.assignedTo.map((user) => user.email)
            : [],
        // assignedTo: task?.assignedTo ?? [], // was trying to pass the User interface for multi-select.tsx | multi-user-select.tsx
        status: task?.status,
      }
    : ({
        title: "",
        description: "",
        dueDate: undefined,
        assignedTo: [],
        status,
      } as TaskFormSchema)

  const [newTaskState, setNewTaskState] = useState(taskFormValues)

  const utils = api.useUtils()

  const addNewTask = api.kanban.addTask.useMutation({
    onSuccess: () => {
      toast.success("New task has been added.")
      void utils.kanban.getTasks.refetch() // <= here
    },
    onError: (e) => {
      toast.error("Failed to add new task.", {
        description: e.message,
      })
    },
  })

  const editTask = api.kanban.editTask.useMutation({
    onSuccess: () => {
      toast.success("Task has been updated.")
      void utils.kanban.getTasks.refetch() // <= here
    },
    onError: (e) => {
      toast.error("Failed to update task.", {
        description: e.message,
      })
    },
  })

  const { data: event } = api.kanban.findMembersFromEvent.useQuery()
  // new variable with event members as aggregate createdBy and participants
  const eventMembers = event
    ? event.participants.length > 0
      ? [event.createdBy, ...event.participants]
      : [event.createdBy]
    : []

  const onSubmit = async (values: TaskFormSchema) => {
    console.log("values", values)
    // const assignedTo = values.assignedTo
    //   ? values.assignedTo.map((email) => email).join(", ")
    //   : null
    // const newValues = {
    //   ...values,
    //   assignedTo,
    // }
    if (!task) addNewTask.mutate(values)
    else editTask.mutate({ id: task.id, ...values })
    onCancel()
  }

  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {},
  })

  // Use useEffect to update the form state when newTaskState changes
  useEffect(() => {
    if (newTaskState) {
      form.reset(newTaskState) // Update the form with newTaskState
    }
  }, [newTaskState, form])

  const assignedToData = useMemo(() => {
    return eventMembers.map((participant) => ({
      id: participant.id,
      name: participant.name,
      email: participant.email,
      image: participant.image,
    }))
  }, [eventMembers])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Take coffee break"
                  {...field}
                  onChange={(e) => {
                    // console.log("onChange")
                    // console.log("e.target.value", e.target.value)
                    field.onChange(e)
                    setNewTaskState({
                      ...newTaskState,
                      title: e.target.value,
                    })
                  }}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. It’s always good to take a break. This 15 minute break will 
recharge the batteries a little."
                  {...field}
                  onBlur={(e) => {
                    // console.log("onBlur")
                    // console.log("e.target.value", e.target.value)
                    field.onBlur()
                    setNewTaskState({
                      ...newTaskState,
                      description: e.target.value,
                    })
                  }}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
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
                  <PopoverContent className="w-auto bg-white p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
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
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task assign to</FormLabel>
              <FormControl>
                {/* <Input
                  placeholder="e.g. test@example.com"
                  {...field}
                  value={field.value ?? undefined}
                /> */}
                <MultiSelector
                  onValuesChange={field.onChange}
                  values={field.value}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select members" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {assignedToData.map((participant) => (
                        <MultiSelectorItem
                          key={participant.id}
                          value={participant.email}
                          onClick={() => {
                            setNewTaskState({
                              ...newTaskState,
                              assignedTo: field.value.includes(
                                participant.email
                              )
                                ? field.value.filter(
                                    (email) => email !== participant.email
                                  )
                                : [...field.value, participant.email],
                            })
                            const isSelected = field.value.includes(
                              participant.email
                            )
                            field.onChange(
                              isSelected
                                ? field.value.filter(
                                    (email) => email !== participant.email
                                  )
                                : [...field.value, participant.email]
                            )
                          }}
                        >
                          <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-100">
                            <AvatarImage
                              src={participant.image!}
                              alt="user image"
                            />
                            <AvatarFallback>
                              {getInitials(
                                participant?.name ?? participant?.email
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>{participant?.name}</div>
                          <div>{participant?.email}</div>
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          defaultValue={status}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Status</FormLabel>
              <FormControl>
                {task === undefined ? (
                  <Button
                    variant="outline"
                    className="w-full text-left"
                    disabled
                  >
                    {field.value}
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full text-left">
                        {field.value}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        {Object.values(TaskStatus)
                          .filter((status) => status !== field.value)
                          .map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => {
                                field.onChange(status)
                              }}
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  )
}
