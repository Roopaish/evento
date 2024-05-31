import { db } from "@/server/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { type UserRole } from "@prisma/client"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"

import { env } from "@/env"

import { sendEmail } from "./email"
import emailTemplates from "./email-templates"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      role: UserRole
    } & DefaultSession["user"]
  }

  // interface User {
  //   // ...other properties
  //   role: UserRole;
  // }
}

const providers = []

if (typeof GoogleProvider === "function") {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (typeof EmailProvider === "function") {
  providers.push(
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        const { host } = new URL(url)
        await sendEmail({
          identifier,
          subject: `Sign in to ${host}`,
          template: {
            html: emailTemplates.verificationRequest.html({
              url,
              host,
              email: identifier,
            }),
            text: emailTemplates.verificationRequest.text({ url, host }),
          },
        })
      },
    })
  )
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...user,
        },
      }
    },
    async signIn({}) {
      return true
    },
  },

  adapter: PrismaAdapter(db),
  providers,
}

export const getServerAuthSession = () => getServerSession(authOptions)
