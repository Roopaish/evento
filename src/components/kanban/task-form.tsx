// import { Button } from "../ui/button"
// import { Input } from "../ui/input"
// import { Label } from "../ui/label"

// export default function TaskForm({ onCancel }: { onCancel: () => void }) {
//   const onSubmit = (values: string) => {
//     onCancel()
//     console.log({ values })
//   }

//   return (
//     <>
//       {/* <div className="grid gap-4 py-4">
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="title" className="text-right">
//             Task Title
//           </Label>
//           <Input id="title" className="col-span-3" />
//         </div>
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="taskDetails" className="text-right">
//             Task Description
//           </Label>
//           <Input id="taskDetails" className="col-span-3" />
//         </div>
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="assignedTo" className="text-right">
//             Assigned to
//           </Label>
//           <Input id="assignedTo" className="col-span-3" />
//         </div>
//       </div>
//       <Button type="button" onClick={() => onSubmit("d")}>
//         Save changes
//       </Button> */}
//     </>
//   )
// }
"use client"

import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TaskStatus } from "@prisma/client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  taskFormSchema,
  type TaskFormSchema,
} from "@/lib/validations/task-form-validation"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

export default function TaskForm({
  status,
  onCancel,
}: {
  status: TaskStatus
  onCancel: () => void
}) {
  const addNewTask = api.kanban.addTask.useMutation()
  // const [taskStatus, setTaskStatus] = useState<TaskStatus>(status)

  const onSubmit = (values: TaskFormSchema) => {
    console.log({ values })
    console.log("status", status)
    const updatedValues = {
      ...values,
      status: status,
    }
    console.log({ updatedValues })
    addNewTask.mutate(updatedValues)
    onCancel()
  }

  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {},
  })

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
                <Input placeholder="" {...field} />
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
                <Textarea placeholder="" {...field} />
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
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task assign to</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Status</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={status}
                  value={status}
                  // required={false}
                  readOnly
                  // className="mx-1 inline-block cursor-pointer rounded border-none bg-blue-500 px-4 py-2 text-center text-lg text-white no-underline transition-all duration-200"
                />
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
