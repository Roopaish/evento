import * as z from "zod"

export type SortFilter = "title" | "created_at" | "updated_at"
export const sortFilter = ["title", "created_at", "updated_at"] as const

export type OrderFilter = "asc" | "desc"
export const orderFilter = ["asc", "desc"] as const

export const PaginatedInput = z.object({
  limit: z.number().min(1).max(100).optional().default(20),
  cursor: z.number().or(z.string()).nullish(),
  sortBy: z.enum(sortFilter).optional().default("created_at"),
  orderBy: z.enum(orderFilter).optional().default("desc"),
})
