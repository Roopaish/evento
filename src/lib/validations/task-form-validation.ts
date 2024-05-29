import * as z from "zod"

export const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 3 characters.",
  }),
  taskDescription: z.string(),
  dueDate: z.coerce.date(),
  assignedTo: z.string().optional(),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>
