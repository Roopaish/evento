import { sendEmail } from "@/server/email"
import emailTemplates from "@/server/email-templates"
import { TRPCError } from "@trpc/server"

import { env } from "@/env"
import { InvitationSchema } from "@/lib/validations/invitation-validation"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const marketingRouter = createTRPCRouter({
  addMultipleEmail: protectedProcedure
    .input(InvitationSchema)
    .mutation(async ({ input, ctx }) => {
      const { emails } = input
      const eventId = ctx.currentEvent

      if (!eventId) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "No Event Selected",
        })
      }

      const emailsSendTo = await ctx.db.emailInvitation.createManyAndReturn({
        data: emails.map((email) => ({
          sendTo: email,
          eventId: eventId,
        })),
        include: {
          event: {
            select: { title: true },
          },
        },
      })

      if (emailsSendTo) {
        const subdomain = await ctx.db.subDomain.findFirst({
          where: {
            eventId: eventId,
          },
        })

        let route = `${env.NEXTAUTH_URL}/events/${eventId}`
        if (subdomain) {
          route = subdomain.route + ".localhost:3000" + "/home"
        }

        await Promise.all(
          emailsSendTo.map((email) => {
            void sendEmail({
              identifier: email.sendTo,
              subject: "Yssss",
              template: {
                html: emailTemplates.campaign.html({
                  email: email.sendTo,
                  websiteUrl: route,
                  eventName: email.event.title,
                }),
                text: emailTemplates.campaign.text({
                  email: email.sendTo,
                  url: route,
                }),
              },
            })
          })
        )
      }

      return emailsSendTo
    }),

  getSentEmail: protectedProcedure.query(async ({ ctx }) => {
    const eventId = ctx.currentEvent
    if (!eventId) {
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: "No Event Selected",
      })
    }
    const emailList = await ctx.db.emailInvitation.findMany({
      where: {
        eventId: eventId,
      },
    })
    return emailList
  }),
})
