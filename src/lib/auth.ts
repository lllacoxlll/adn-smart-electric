import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { nextCookies } from 'better-auth/next-js'
import { Role } from '@/generated/prisma'
import { admin } from 'better-auth/plugins'
import { ac, roles} from '@/lib/permissions'

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
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: false,
    // disableSignUp: true,
  },
  // databaseHooks: {
  //   user: {
  //     create: {
  //       before: async (user) => {
  //         if (user.email === process.env.ADMIN_EMAIL) {
  //           return { data: { ...user, role: Role.ADMIN } }
  //         }

  //         return { data: user }
  //       },
  //     },
  //   },
  // },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: Role.EMPLOYEE,
      adminRoles: [Role.ADMIN],
      ac,
      roles,
    })
  ],
})
