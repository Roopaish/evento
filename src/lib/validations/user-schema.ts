import * as z from "zod"

function isValidCUID(cuid: string): boolean {
  // Basic validation to check if the cuid is a string of 25 characters starting with 'c'
  const cuidPattern = /^c[a-zA-Z0-9]{24}$/
  return cuidPattern.test(cuid)
}

export const editProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 3 characters.",
  }),
  address: z.string(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  bio: z.string().optional(),
})

export const userIdSchema = z.object({
  id: z.string().refine((id) => isValidCUID(id), "Invalid User ID"),
})

export type EditProfileForm = z.infer<typeof editProfileFormSchema>
export type UserId = z.infer<typeof userIdSchema>
