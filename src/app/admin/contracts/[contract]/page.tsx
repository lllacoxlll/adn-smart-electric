'use server'

import ServiceContract from '@/components/servicecontract'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Contract } from '@/types/Contract'
import { headers } from 'next/headers'

export default async function Page({ params }: { params: { contract: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const { contract } = await params

  const contractData = await prisma.serviceRequest.findUnique({
    where: {
      serviceRequestToken: contract,
    },
    omit: {
      employeeId: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      customer: true,
      files: true,
    },
  })

  console.log(JSON.parse(JSON.stringify(contractData)))

  const downloadedImages: string[] = []
  let employeeSig: string = ''
  let clientSig: string = ''
  if (contractData && contractData.files.length > 0) {
    for (let i = 0; i < contractData!.files.length; i++) {
      if (contractData.files[i].fileType === 'IMAGE') {
        const [, , , fourth, fifth] = contractData.files[i].url.split('/')
        const contractImageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download/${fourth}/${fifth}`)
        const res = await contractImageResponse.json()
        downloadedImages.push(contractData.files[i].url + '?' + res)
      } else if (contractData.files[i].fileType === 'EMPLOYEE_SIG') {
        const [, , , fourth, fifth] = contractData.files[i].url.split('/')
        const contractImageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download/${fourth}/${fifth}`)
        const res = await contractImageResponse.json()
        employeeSig = contractData.files[i].url + '?' + res
      } else if (contractData.files[i].fileType === 'CUSTOMER_SIG') {
        const [, , , fourth, fifth] = contractData.files[i].url.split('/')
        const contractImageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download/${fourth}/${fifth}`)
        const res = await contractImageResponse.json()
        clientSig = contractData.files[i].url + '?' + res
      }
    }
  }

  const contractObj: Contract = {
    id: contract,
    addressLine1: contractData!.addressLine1,
    addressLine2: contractData!.addressLine2!,
    city: contractData!.city,
    state: contractData!.state,
    zipCode: contractData!.zipCode,
    country: contractData!.country,
    serviceDetails: contractData!.serviceDetails,
    hasClientSig: contractData!.hasClientSig,
    hasTechSig: contractData!.hasTechSig,
    agreementDate: contractData!.agreementDate,
    completionDate: contractData!.completionDate!,
    propertyType: contractData!.propertyType.toLowerCase() as 'residential' | 'commercial',
    estimatedCost: contractData!.estimatedCost.toNumber(),
    paymentStatus: contractData!.paymentStatus.toLowerCase() as 'paid' | 'not paid' | 'processing',
    deposit: contractData!.deposit!.toNumber(),
    balanceDue: contractData!.balanceDue.toNumber(),
    customerEmail: contractData!.customer.email,
    customerName: contractData!.customer.name,
    customerPhone: contractData!.customer.phone,
    imageUrls: downloadedImages,
    clientSig: clientSig,
    techSig: employeeSig,
  }

  return (
    <>
      <div className="pt-50">Contract #: {contract}</div>

      {session && <ServiceContract employeeName={contractData!.user.name} contract={contractObj} mode="edit" />}

      {!session && !contractObj.hasClientSig && <ServiceContract employeeName={contractData!.user.name} contract={contractObj} mode="edit" />}

      {!session && contractObj.hasClientSig && <ServiceContract employeeName={contractData!.user.name} contract={contractObj} mode="view" />}
    </>
  )
}
