'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function deleteEntityAction({ Id }: { Id: string | number }) {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session) throw new Error('Unauthorized')

  if (session.user.role !== 'ADMIN' || session.user.id === Id) {
    throw new Error('Forbidden')
  }

  try {
    if (typeof Id === 'string') {
      await auth.api.removeUser({
        headers: headersList,
        body: {
          userId: Id,
        },
      })
    } else if (typeof Id === 'number') {
      await prisma.file.deleteMany({
        where: {
          serviceRequestId: Id,
        },
      })
      await prisma.serviceRequest.delete({
        where: {
          id: Id,
        },
      })
    }

    revalidatePath('/admin/dashboard')
    return { error: null }
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message }
    }

    return { error: 'Internal Server Error' }
  }
}
