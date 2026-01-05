'use server'

import { FileType } from '@/generated/prisma'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

interface ContractFiles {
  techSig?: string,
  clientSig?: string,
  imageUrls?: string[],
}

export async function updateContract(contractDataId: string, contractFiles?: ContractFiles, contractNonFiles?: object) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  let canUpdateContracts

  if (session) {
    canUpdateContracts = await auth.api.userHasPermission({
      body: {
        userId: session!.user.id,
        permission: {
          servicerequest: ['update'],
        },
      },
    })
  }

  const existingContract = await prisma.serviceRequest.findUnique({
    where: {
      serviceRequestToken: contractDataId,
    },
    include: {
      files: true,
    },
  })

  try {
    if (session && canUpdateContracts && existingContract) {
      if (contractNonFiles) {
        await prisma.serviceRequest.update({
          where: {
            serviceRequestToken: contractDataId,
          },
          include: {
            files: true,
          },
          data: contractNonFiles,
        })
      }
      if (contractFiles && contractFiles.techSig) {
        if (existingContract.files.some((item) => item.fileType === 'EMPLOYEE_SIG')) {
          throw new Error("Tech signature already present")
        }
        await prisma.file.create({
          data: {
            url: contractFiles.techSig as string,
            fileType: FileType.EMPLOYEE_SIG,
            serviceRequestId: existingContract.id,
          },
        })
      }
      if (contractFiles && contractFiles.clientSig) {
        if (existingContract!.files.some(item => item.fileType === 'CUSTOMER_SIG')) {
          throw new Error("Customer signature already present")
        }
        await prisma.file.create({
          data: {
            url: contractFiles.clientSig as string,
            fileType: FileType.CUSTOMER_SIG,
            serviceRequestId: existingContract.id,
          },
        })
      }
      if (contractFiles && contractFiles.imageUrls) {
        contractFiles.imageUrls!.map(async(url) => {
          await prisma.file.create({
            data: {
              url: url,
              fileType: FileType.IMAGE,
              serviceRequestId: existingContract.id,
            },
          })
        })
      }

      return { error: null }
    } else if (existingContract && !session && !canUpdateContracts) {
      if (contractFiles && contractFiles.clientSig) {
        if (existingContract.files.some((item) => item.fileType === 'CUSTOMER_SIG')) {
          throw new Error("Customer signature already present")
        }
        await prisma.file.create({
          data: {
            url: contractFiles.clientSig as string,
            fileType: FileType.CUSTOMER_SIG,
            serviceRequestId: existingContract.id,
          },
        })

        return { error: null }
      }

      throw new Error("You don't have permission to update this field")
    }

    throw new Error("One or more field updates failed")
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "Internal Server Error" }
  }
}
