import { TaskStatus } from "@prisma/client"
import * as z from "zod"

import { isValidCUID, userSchema } from "./user-schema"

export const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 3 characters.",
  }),
  description: z.string(),
  dueDate: z.coerce.date().nullish(),
  assignedTo: z.array(
    z.string().refine((id) => isValidCUID(id), "Invalid User ID")
  ),
  // assignedTo: userSchema.array(),
  status: z.nativeEnum(TaskStatus).optional(),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>
