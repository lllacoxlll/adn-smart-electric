import ServiceContract from '@/components/servicecontract'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteEntityButton } from '@/components/delete-user-button'

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('auth/login')

  const customers = await prisma.customer.findMany()

  const contracts = await prisma.serviceRequest.findMany()

  return (
    <div className="px-8 py-16 container mx-auto max-w-7xl space-y-8">
      <div className="w-full overflow-x-visible">
        <table className="table-auto min-w-full whitespace-nowrap mt-10 mx-10 mb-20">
          <caption className="text-left text-xl font-bold mb-2">Customers</caption>
          <thead>
            <tr className="border-b text-sm text-left">
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">Phone</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b text-sm text-left">
                <td className="px-4 py-2 text-left">{customer.name}</td>
                <td className="px-4 py-2 text-left">{customer.email}</td>
                <td className="px-4 py-2 text-left">{customer.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="table-auto min-w-full whitespace-nowrap mt-10 mx-10 mb-20">
          <caption className="text-left text-xl font-bold mb-2">Contracts</caption>
          <thead>
            <tr className="border-b text-sm text-left">
              <th className="px-2 py-2">Request Token</th>
              <th className="px-2 py-2">Customer Signed?</th>
              <th className="px-2 py-2">Employee Signed?</th>
              <th className="px-2 py-2">Customer ID</th>
              <th className="px-2 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id} className="border-b text-sm text-left">
                <td className="px-4 py-2">
                  <Link href={`http://localhost:3000/admin/contracts/${contract.serviceRequestToken}`}>{contract.serviceRequestToken}</Link>
                </td>
                <td className="px-4 py-2">{contract.hasClientSig}</td>
                <td className="px-4 py-2">{contract.hasTechSig}</td>
                <td className="px-4 py-2">{contract.customerId}</td>
                <td className="px-4 py-2 text-center">{<DeleteEntityButton Id={contract.id} />}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-2xl text-center">Create New Electrical Contract</h2>
        <ServiceContract employeeName={session.user.name} mode="create" />
      </div>
    </div>
  )
}
