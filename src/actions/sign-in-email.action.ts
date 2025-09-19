'use server'

import { auth } from '@/lib/auth'
import { APIError } from 'better-auth/api'

export async function signInEmailActon(formData: FormData) {
  const email = String(formData.get('email'))
  if (!email) return { error: 'Please enter your email' }

  const password = String(formData.get('password'))
  if (!password) return { error: 'Please enter your password' }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      }
    })

    return { error: null }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message }
    }

    return { error: 'Internal Server Error' }
  }
}
