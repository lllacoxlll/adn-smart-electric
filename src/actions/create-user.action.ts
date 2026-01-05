'use server'

import { Role } from '@/generated/prisma'
import { auth } from '@/lib/auth'
import { EmployeeData } from '@/lib/schemas'
import { APIError } from 'better-auth'
import { revalidatePath } from 'next/cache'

export async function createUserAction(formData: EmployeeData) {
  try {
    await auth.api.createUser({
      body: {
        email: String(formData.email),
        password: String(formData.password),
        name: String(formData.name),
        role: Role.EMPLOYEE,
      },
    })

    revalidatePath('/admin/dashboard')
    return { error: null }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message }
    }
    else if (error instanceof Error) {
      return { error: error.message}
    }

    return { error: 'Internal Server Error' }
  }
}
