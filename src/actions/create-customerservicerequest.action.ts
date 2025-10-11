'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function createCustomerServiceRequest(firstName: string, lastName: string, phone: string, email: string, street: string, city: string, state: string, zipCode: string, requestDetails: string, isSigned: boolean) {
  try {
    const canCreateCustomers = await auth.api.userHasPermission({
      body: {
        permission: {
          customer: ['create'],
        },
      },
    })

    const canCreateServiceRequests = await auth.api.userHasPermission({
      body: {
        permission: {
          servicerequest: ['create'],
        },
      },
    })

    if (canCreateCustomers && canCreateServiceRequests) {
      let parent = await prisma.customer.findUnique({
        where: { email: email },
      })

      if (!parent) {
        parent = await prisma.customer.create({
          data: {
            firstName,
            lastName,
            phone,
            email,
          },
        })
      }

      await prisma.serviceRequest.create({
        data: {
          street,
          city,
          state,
          zipCode,
          requestDetails,
          isSigned,
          customerId: parent.id,
        },
      })

      return { error: null }
    }
  } catch (error) {
    return { error }
  }
}
