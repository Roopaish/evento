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

      const existingSubdomain = await ctx.db.subDomain.findUnique({
        where: {
          eventId: ctx.currentEvent,
        },
      })

      if (
        (await ctx.db.subDomain.findFirst({ where: { route: route } })) !=
          null &&
        existingSubdomain?.route !== route
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Already Exists",
        })
      }

      if (existingSubdomain) {
        return ctx.db.subDomain.update({
          where: {
            id: existingSubdomain.id,
          },
          data: {
            templateChosen: TemplateChosen,
            route: route,
          },
        })
      }

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

  checkAvailable: publicProcedure.input(route).query(async ({ input, ctx }) => {
    const { url } = input
    const search = await ctx.db.subDomain.findFirst({
      where: { route: url },
    })

    if (search == null) {
      return false
    } else {
      return search
    }
  }),

  getSubDomains: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subDomain.findMany({
      where: {
        userId: ctx.session.user.id,
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

  getLinkedEvent: publicProcedure
    .input(z.object({ subdomain: z.string() }))
    .query(async ({ input, ctx }) => {
      const { subdomain } = input

      if (!subdomain) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subdomain Invalid",
        })
      }

      const event = await ctx.db.subDomain.findFirst({
        where: { route: subdomain },
        select: { eventId: true, templateChosen: true },
      })

      return event
    }),
})
