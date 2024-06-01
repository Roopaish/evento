import { Status } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

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

    return ctx.db.jobApplication.findMany({
      where: {
        jobPosition: {
          eventId: ctx.currentEvent,
        },
      },
      include: {
        jobPosition: true,
        user: true,
      },
    })
  }),

  resolveJobApplication: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.nativeEnum(Status),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.currentEvent) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please Select Event First",
        })
      }

      const { id, status } = input

      const application = await ctx.db.jobApplication.findUnique({
        where: { id },
      })

      if (application?.status == status) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Bad Data Input",
        })
      }

      const resolve = await ctx.db.jobApplication.update({
        where: {
          id,
        },
        data: {
          status,
        },
        include: {
          user: {
            select: { id: true, image: true, name: true },
          },
        },
      })

      await ctx.db.event.update({
        where: {
          id: ctx.currentEvent,
        },
        data: {
          participants: { connect: { id: application?.userId } },
        },
      })

      return resolve.status
    }),

  deleteJobApplication: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.currentEvent) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please Select Event First",
        })
      }
      const { id } = input

      const deleteJobApplication = ctx.db.jobApplication.delete({
        where: { id },
      })
      return deleteJobApplication
    }),

  getAppliedApplications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.jobApplication.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        jobPosition: true,
      },
    })
  }),
})
