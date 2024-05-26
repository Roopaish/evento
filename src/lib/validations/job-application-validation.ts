import { z } from "zod"

const jobApplicationSchema = z.object({
  cv: z.string(),
  pan: z
    .string()
    .min(10, { message: "pan has 10 digits" })
    .max(10, { message: "pan has 10 digits" }),
  message: z.string().max(500, { message: "Max characters allowed:500" }),
  jobPositionId: z.number(),
})

export { jobApplicationSchema }
