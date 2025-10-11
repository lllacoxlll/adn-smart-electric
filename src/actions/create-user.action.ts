'use server'

import { Role } from '@/generated/prisma'
import { auth } from '@/lib/auth'
import { APIError } from 'better-auth'
import { revalidatePath } from 'next/cache'

export async function createUserAction(formData: FormData) {
  try {
    await auth.api.createUser({
      body: {
        email: String(formData.get('email')),
        password: String(formData.get('password')),
        name: String(formData.get('name')),
        role: Role.EMPLOYEE,
      },
    })

    revalidatePath('/admin/dashboard')
    return { error: null }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message }
    }

    return { error: 'Internal Server Error' }
  }
}
