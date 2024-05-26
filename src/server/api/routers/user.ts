import { editProfileFormSchema } from "@/lib/validations/edit-profile-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
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
