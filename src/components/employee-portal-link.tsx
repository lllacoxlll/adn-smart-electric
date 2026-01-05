'use client'

import { useSession } from '@/lib/auth-client'
import Link from 'next/link'

export const EmployeePortalLink = () => {
  const { data: session } = useSession()

  const href = session ? '/profile' : '/auth/login'

  return (
    <div className="flex flex-col item-center gap-4 text-white hover:text-red-600">
      <Link href={href}>Employees</Link>
    </div>
  )
}
