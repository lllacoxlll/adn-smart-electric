import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { nextCookies } from 'better-auth/next-js'
import { Role } from '@/generated/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      role: {
        type: ['ADMIN', 'EMPLOYEE'] as Array<Role>,
        required: true,
        defaultValue: 'EMPLOYEE',
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.email === process.env.ADMIN_EMAIL) {
            return { data: { ...user, role: Role.ADMIN } }
          }

          return { data: user }
        },
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  plugins: [nextCookies()],
})
