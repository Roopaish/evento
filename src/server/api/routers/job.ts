import { jobApplicationSchema } from "@/lib/validations/job-application-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const jobRouter = createTRPCRouter({
  addApplication: protectedProcedure
    .input(jobApplicationSchema)
    .mutation(({ input, ctx }) => {
      const { pan, cv, message, jobPositionId, ...rest } = input

      const application = ctx.db.jobApplication.create({
        data: {
          ...rest,
          message: message,
          userId: ctx.session.user.id,
          jobPositionId: jobPositionId,
          cv: {
            connect: {
              id: cv,
            },
          },
          pan,
        },
      })
    }),
})
