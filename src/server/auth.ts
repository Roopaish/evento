import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { type UserRole } from "@prisma/client"
import { db } from "~/server/db"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { env } from "~/env"

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
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
}

export const getServerAuthSession = () => getServerSession(authOptions)
