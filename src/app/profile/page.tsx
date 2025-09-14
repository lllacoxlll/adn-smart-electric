import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <p className="text-destructive">Unauthorized</p>
  }

  return (
    <div>
      <div>
        <h1>Profile Page</h1>
      </div>
    </div>
  )
}