import { Status } from "@prisma/client"
import { z } from "zod"

const jobApplicationSchema = z.object({
  cv: z.object({ url: z.string(), id: z.string() }),
  pan: z
    .string()
    .min(10, { message: "pan has 10 digits" })
    .max(10, { message: "pan has 10 digits" }),
  message: z.string().max(500, { message: "Max characters allowed:500" }),
  jobPositionId: z.number(),
})

const jobApplicationAdminSchema = jobApplicationSchema.extend({
  status: z.nativeEnum(Status),
})

export type JobApplicationAdminSchema = z.infer<
  typeof jobApplicationAdminSchema
>

export { jobApplicationSchema, jobApplicationAdminSchema }
