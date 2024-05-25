import { EventType } from "@prisma/client"
import * as z from "zod"

import { PaginatedInput } from "./pagination"

export const SearchFiltersSchema = z
  .object({
    q: z.string().optional(),
    type: z
      .string()
      .optional()
      .transform((val) => val?.toUpperCase())
      .refine(
        (val) =>
          val === undefined ||
          Object.values(EventType).includes(val as EventType),
        {
          message: "Please select a valid type.",
        }
      ),
    date: z.coerce.date().optional(),
    address: z.string().optional(),
    hasJobOffers: z.boolean().optional(),
  })
  .merge(
    PaginatedInput.omit({
      cursor: true,
      limit: true,
    })
  )

export type SearchSearchParams = z.infer<typeof SearchFiltersSchema>
