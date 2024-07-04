import { TemplateChosen } from "@prisma/client"
import { z } from "zod"

export const subdomainSchema = z.object({
  route: z
    .string()
    .min(4, { message: "Atleast 4 letters" })
    .max(30, { message: "Maximum 30 charcters" }),
  TemplateChosen: z.enum(["Template1", "Template2"]),
})
