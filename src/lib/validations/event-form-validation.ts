import { EventType } from "@prisma/client"
import * as z from "zod"

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const eventFormSchema = z.object({
  title: z.string().min(4).max(50),
  type: z.nativeEnum(EventType),
  date: z.coerce.date(),
  location: z.object({
    address: z.string(),
    lat: z.string().optional(),
    lng: z.string().optional(),
  }),
  capacity: z.coerce.number().min(0),
  description: z.string().min(80),
  staffs: z.array(z.string().email()).optional(),
  instruction: z.string().optional(),
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    )
    .optional(),
})
