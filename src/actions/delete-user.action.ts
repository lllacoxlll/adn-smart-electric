'use server'

import { auth } from '@/lib/auth'
// import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function deleteUserAction({ userId }: { userId: string }) {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session) throw new Error('Unauthorized')

  if (session.user.role !== 'ADMIN' || session.user.id === userId) {
    throw new Error('Forbidden')
  }

  try {
    // await prisma.user.delete({
    //   where: {
    //     id: userId,
    //     role: 'EMPLOYEE',
    //   },
    // })
    await auth.api.removeUser({
      headers: headersList,
      body: {
        userId: userId,
      },
    })

    revalidatePath('/admin/dashboard')
    return { error: null }
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message }
    }

    return { error: 'Internal Server Error' }
  }
}
