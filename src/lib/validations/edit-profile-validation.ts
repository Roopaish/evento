import * as z from "zod"

export const editProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 3 characters.",
  }),
  address: z.string(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  bio: z.string().optional(),
})
