import * as z from "zod"

export const chatGroupSchema = z.object({
  name: z.string(),
})
