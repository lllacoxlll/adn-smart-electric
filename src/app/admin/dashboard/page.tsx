import { CreateUserForm } from '@/components/create-new-user'
import { DeleteEntityButton, PlaceHolderDeleteEntityButton } from '@/components/delete-user-button'
import { ReturnButton } from '@/components/return-button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session) redirect('/auth/login')

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
        <div className="space-y-8">
          <ReturnButton href="/profile" label="Profile" />

          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <p className="p-2 rounded-md text-lg bg-red-600 text-white font-bold">FORBIDDEN</p>
        </div>
      </div>
    )
  }

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: 'name',
    }
  })

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/profile" label="Profile" />

        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">ACCESS GRANTED</p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="table-auto min-w-full whitespace-nowrap">
          <caption className="text-left text-xl font-bold mb-2">Active Employees</caption>
          <thead>
            <tr className="border-b text-sm text-left">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2 text-center">Role</th>
              <th className="px-2 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b text-sm text-left">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center">{user.role}</td>
                <td className="px-4 py-2 text-center">{user.role === 'EMPLOYEE' ? <DeleteEntityButton Id={user.id} /> : <PlaceHolderDeleteEntityButton />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateUserForm />
    </div>
  )
}
