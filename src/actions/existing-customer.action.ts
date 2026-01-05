'use server'

import prisma from '@/lib/prisma'

export async function existingCustomerQuery(email: string, name: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { email: email },
    })

    if (customer && customer.name !== name) {
      return { error: 'A different customer with this email already exists. Please try a different email if adding a new customer to the system.' }
    }

    return { error: null }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Internal Server Error' }
  }
}
