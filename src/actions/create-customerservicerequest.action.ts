'use server'

import prisma from '@/lib/prisma'
import { PropertyType, Status, FileType } from '@/generated/prisma'
import { auth } from '@/lib/auth'
import { ContractData } from '@/lib/schemas'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createContract(contractData: ContractData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  try {
      const canCreateCustomers = await auth.api.userHasPermission({
        body: {
          userId: session!.user.id,
          permission: {
            customer: ['create'],
          },
        },
      })

      const canCreateServiceRequests = await auth.api.userHasPermission({
        body: {
          userId: session!.user.id,
          permission: {
            servicerequest: ['create'],
          },
        },
      })

    if (canCreateCustomers && canCreateServiceRequests) {
      let customer = await prisma.customer.findUnique({
        where: { email: contractData.email },
      })

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: contractData.customerName,
            phone: contractData.phone,
            email: contractData.email,
          },
        })
      }

      const contract = await prisma.serviceRequest.create({
        data: {
          addressLine1: contractData.addressLine1,
          addressLine2: contractData.addressLine2,
          city: contractData.city,
          state: contractData.state,
          zipCode: contractData.zipCode,
          country: contractData.country,
          serviceDetails: contractData.serviceDetails,
          hasClientSig: contractData.hasClientSig,
          hasTechSig: contractData.hasTechSig,
          agreementDate: contractData.agreementDate,
          propertyType: contractData.propertyType.toUpperCase() === 'RESIDENTIAL' ? PropertyType.RESIDENTIAL : PropertyType.COMMERCIAL,
          estimatedCost: contractData.estimatedCost,
          paymentStatus: contractData.paymentStatus.toUpperCase() === 'NOT_PAID' ? Status.NOT_PAID : Status.PAID,
          deposit: contractData.deposit,
          balanceDue: contractData.balanceDue,
          customerId: customer.id,
          employeeId: session!.user.id,
        },
      })

      if (contract && contractData.imageUrls) {
        contractData.imageUrls.forEach(async (url) => {
          await prisma.file.create({
            data: {
              url: url,
              fileType: FileType.IMAGE,
              serviceRequestId: contract.id,
            },
          })
        })
      }

      if (contract && contractData.hasTechSig) {
        await prisma.file.create({
          data: {
            url: contractData.techSig!,
            fileType: FileType.EMPLOYEE_SIG,
            serviceRequestId: contract.id,
          },
        })
      }

      if (contract && contractData.hasClientSig) {
        await prisma.file.create({
          data: {
            url: contractData.clientSig,
            fileType: FileType.CUSTOMER_SIG,
            serviceRequestId: contract.id,
          },
        })
      }

      revalidatePath('/admin/customers')

      return { error: null }
    }

    return { error: "You don't have permission to perform this action." }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Internal Server Error' }
  }
}
