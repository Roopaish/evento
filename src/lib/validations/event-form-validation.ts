import { EventType } from "@prisma/client"
import * as z from "zod"

export const eventFormSchema = z.object({
  title: z.string().min(4).max(50),
  type: z.nativeEnum(EventType),
  date: z.coerce.date(),
  address: z.string(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  capacity: z.coerce.number().min(0),
  description: z.string().min(80),
  instruction: z.string().optional(),
  price: z.coerce.number().optional(),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  assets: z.array(z.object({ url: z.string(), id: z.string() })),
  managerImage: z.object({ url: z.string(), id: z.string() }).optional(),

  jobPositions: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        noOfEmployees: z.coerce.number(),
        salary: z.coerce.number().optional(),
      })
    )
    .optional(),
})
