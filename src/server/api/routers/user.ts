import {
  editProfileFormSchema,
  userIdSchema,
} from "@/lib/validations/user-schema"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    })
    return user
  }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany()
    return users
  }),

  getUserById: protectedProcedure
    .input(userIdSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      })
      return user
    }),

  editProfile: protectedProcedure
    .input(editProfileFormSchema)
    .mutation(({ ctx, input }) => {
      const user = ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      })
      return user
    }),
})
