import { deleteUploadedImages } from "@/server/utils/upload-image"
import { TRPCError } from "@trpc/server"
import * as z from "zod"

import { PaginatedInput } from "@/lib/validations/pagination"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const assetRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(PaginatedInput)
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, sortBy, orderBy, limit } = input

        const data = await ctx.db.asset.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            id: true,
            name: true,
            size: true,
            createdAt: true,
            thumbnailUrl: true,
            url: true,
            event: {
              select: {
                id: true,
                title: true,
              },
            },
          },

          take: limit + 1,
          cursor:
            typeof cursor === "string"
              ? {
                  id: cursor,
                }
              : undefined,
          orderBy: {
            name: sortBy === "title" ? orderBy : undefined,
            createdAt: sortBy === "created_at" ? orderBy : undefined,
            updatedAt: sortBy === "updated_at" ? orderBy : undefined,
          },
        })

        let nextCursor: string | undefined = undefined
        if (data.length > limit) {
          const nextItem = data.pop()
          nextCursor = nextItem?.id
        }
        return {
          data,
          nextCursor,
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: e,
        })
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedFileIds = await deleteUploadedImages(input.ids)

        const deletedItems = await ctx.db.asset.deleteMany({
          where: {
            id: { in: deletedFileIds },
          },
        })

        if (deletedItems.count === 0) {
          return { success: false, message: "Unable to delete files." }
        } else if (deletedItems.count < input.ids.length) {
          return { success: false, message: "Unable to delete some files." }
        } else {
          return { success: true, message: "Files are deleted." }
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: e,
        })
      }
    }),
})
