import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { subdomainSchema } from "@/lib/validations/subdomain-validation"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

const route = z.object({
  url: z.string(),
})
export const subdomainRouter = createTRPCRouter({
  addSubDomain: protectedProcedure
    .input(subdomainSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.currentEvent) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please select event first",
        })
      }

      const { route, TemplateChosen } = input
      const subdomain = await ctx.db.subDomain.create({
        data: {
          route: route,
          templateChosen: TemplateChosen,
          userId: ctx.session.user.id,
          eventId: ctx.currentEvent,
        },
      })
      return subdomain
    }),

  checkAvailable: protectedProcedure
    .input(route)
    .query(async ({ input, ctx }) => {
      const { url } = input
      const search = await ctx.db.subDomain.findFirst({
        where: { route: url },
      })

      if (search == null) {
        return true
      } else {
        return false
      }
    }),

  getSubDomains: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subDomain.findMany({
      where: {
        userId: await ctx.session.user.id,
      },
    })
  }),

  getEventDomain: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.currentEvent) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Please select event first",
      })
    }
    return ctx.db.subDomain.findFirst({
      where: {
        eventId: ctx.currentEvent,
      },
    })
  }),
})
