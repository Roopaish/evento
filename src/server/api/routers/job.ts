import { TRPCError } from "@trpc/server"

import { jobApplicationSchema } from "@/lib/validations/job-application-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const jobRouter = createTRPCRouter({
  addApplication: protectedProcedure
    .input(jobApplicationSchema)
    .mutation(async ({ input, ctx }) => {
      const { pan, cv, message, jobPositionId, ...rest } = input

      const application = await ctx.db.jobApplication.create({
        data: {
          ...rest,
          message: message,
          userId: ctx.session.user.id,
          jobPositionId: jobPositionId,
          cv: {
            connect: {
              id: cv.id,
            },
          },
          pan,
        },
      })

      return application
    }),

  getApplications: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.currentEvent) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Please select event first",
      })
    }
    // return ctx.db.jobApplication
  }),
})
