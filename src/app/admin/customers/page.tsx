import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('auth/login')
  
  const customers = await prisma.customer.findMany()
  
  return (
    <div className="w-full overflox-x-auto">
      <table className="table-auto min-w-full whitespace-nowrap">
        <caption className="text-left text-xl font-bold mb-2">Customers</caption>
        <thead>
          <tr className="border-b text-sm text-left">
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">First Name</th>
            <th className="px-2 py-2">Last Name</th>
            <th className="px-2 py-2">Email</th>
            <th className="px-2 py-2 text-center">Phone</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b text-sm text-left">
              <td className="px-4 py-2">{customer.id}</td>
              <td className="px-4 py-2">{customer.firstName}</td>
              <td className="px-4 py-2">{customer.lastName}</td>
              <td className="px-4 py-2 text-center">{customer.email}</td>
              <td className="px-4 py-2 text-center">{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
