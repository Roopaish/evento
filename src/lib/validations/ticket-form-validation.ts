import * as z from "zod"

export const ticketFormSchema = z.object({
  type: z.string().min(1).max(50),
  price: z.coerce.number().min(0),
  color: z.string().min(1).max(50),
})

export type TicketFormSchema = z.infer<typeof ticketFormSchema>
