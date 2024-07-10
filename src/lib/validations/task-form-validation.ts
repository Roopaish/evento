import { TaskStatus } from "@prisma/client"
import * as z from "zod"

export const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 3 characters.",
  }),
  description: z.string(),
  dueDate: z.coerce.date().nullish(),
  assignedTo: z.array(z.string().email()),
  // assignedTo: z.array(
  //   z.string().refine((id) => isValidCUID(id), "Invalid User ID")
  // ),
  // assignedTo: userSchema.array(), // was trying to pass the User interface for multi-select.tsx | multi-user-select.tsx
  status: z.nativeEnum(TaskStatus).optional(),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>
