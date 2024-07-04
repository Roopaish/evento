import { connect } from "http2"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { subdomainSchema } from "@/lib/validations/subdomain-validation"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

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
      const subdomain = ctx.db.subDomain.create({
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
    .input(subdomainSchema)
    .query(async ({ input, ctx }) => {
      const { route } = input
      const search = ctx.db.subDomain.findFirst({
        where: { route: route },
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
})
