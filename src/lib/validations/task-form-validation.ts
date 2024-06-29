import { TaskStatus } from "@prisma/client"
import * as z from "zod"

export const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 3 characters.",
  }),
  description: z.string(),
  dueDate: z.coerce.date().nullish(),
  assignedTo: z
    .string()
    .nullable()
    .transform((val, ctx) => {
      try {
        if (!val) return null
        const emails = [...new Set(val.split(","))].map((email) => email.trim())
        // validate email as email
        emails.forEach((email) => {
          if (!z.string().email().safeParse(email).success) {
            throw new Error("Invalid email address.")
          }
        })
        if (emails.length < 1) return null
        return emails
      } catch (err) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email address.",
          fatal: true,
        })
        return z.never() as never
      }
    }),
  status: z.nativeEnum(TaskStatus).optional(),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>
