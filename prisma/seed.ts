import { auth } from '../src/lib/auth'
import prisma from '../src/lib/prisma'
import { Role } from '../src/generated/prisma/client'

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  })

  if (existingAdmin) {
    if (existingAdmin.role === 'EMPLOYEE') {
      await prisma.user.update({
        where: {
          email: process.env.ADMIN_EMAIL!,
        },
        data: {
          role: Role.ADMIN,
        },
      })
    }
  } else {
    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: process.env.ADMIN_NAME!,
          email: process.env.ADMIN_EMAIL!,
          password: process.env.ADMIN_PASSWORD!,
        },
      })

      await prisma.user.update({
        where: { email: process.env.ADMIN_EMAIL! },
        data: { role: Role.ADMIN },
      })

      console.log('Sign up successful:', res)

    } catch (e) {
      console.log('Sign up failed:', e)
    }
  }
}

main()
