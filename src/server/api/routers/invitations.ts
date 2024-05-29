import { sendEmail } from "@/server/email"
import emailTemplates from "@/server/email-templates"
import { TRPCError } from "@trpc/server"
import * as z from "zod"

import { env } from "@/env"
import { InvitationSchema } from "@/lib/validations/invitation-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const invitationRouter = createTRPCRouter({
  invite: protectedProcedure
    .input(
      InvitationSchema.extend({
        eventId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { emails, eventId } = input

      const event = await ctx.db.event.findUnique({
        where: {
          id: eventId,
          createdById: ctx.session.user.id,
        },
      })

      if (!event) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the creator of the event can invite members",
        })
      }

      const invitedMembers = await ctx.db.invitation.createManyAndReturn({
        data: emails.map((email) => ({
          email,
          eventId,
          senderId: ctx.session.user.id,
        })),
        include: {
          event: {
            include: {
              assets: true,
            },
          },
        },
      })

      if (invitedMembers) {
        await Promise.all([
          ...invitedMembers.map(async (member) => {
            await sendEmail({
              identifier: member.email,
              subject: `You have been invited to an event`,
              template: {
                html: emailTemplates.invitation.html({
                  email: member.email,
                  eventURL: `${env.NEXTAUTH_URL}/events/${eventId}`,
                  eventName: event.title,
                  url: `${env.NEXTAUTH_URL}/events/${eventId}/join?token=${member.uniqueToken}`,
                }),
                text: emailTemplates.invitation.text({
                  email: member.email,
                  url: `${env.NEXTAUTH_URL}/events/${eventId}/join?token=${member.uniqueToken}`,
                }),
              },
            })
          }),
        ])
      }

      return invitedMembers
    }),

  verify: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { token } = input

      if (!ctx.session.user.email) {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to be logged in to verify the invitation",
        })
      }

      const invitation = await ctx.db.invitation.findUnique({
        where: {
          uniqueToken: token,
          email: ctx.session.user.email,
        },
        include: {
          event: true,
        },
      })

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        })
      }

      await ctx.db.event.update({
        where: {
          id: invitation.eventId,
        },
        data: {
          participants: {
            connect: {
              email: ctx.session.user.email,
            },
          },
        },
      })

      return invitation
    }),
})
