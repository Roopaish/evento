import { z } from "zod"

export const subdomainSchema = z.object({
  route: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-z0-9-]+$/),
  TemplateChosen: z.enum(["Template1", "Template2"]),
})
