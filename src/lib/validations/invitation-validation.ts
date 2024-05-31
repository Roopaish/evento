import * as z from "zod"

export const InvitationSchema = z.object({
  emails: z.array(z.string().email()),
})
