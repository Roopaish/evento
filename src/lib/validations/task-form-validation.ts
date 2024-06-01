import { TaskStatus } from "@prisma/client"
import * as z from "zod"

export const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 3 characters.",
  }),
  description: z.string(),
  dueDate: z.coerce.date().optional(),
  assignedTo: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>
