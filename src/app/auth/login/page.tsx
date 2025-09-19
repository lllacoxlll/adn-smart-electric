import { LoginForm } from '@/components/login-form'
import { ReturnButton } from '@/components/return-button'

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        
        <h1 className="text-3xl font-bold">Login</h1>
      </div>

      <LoginForm />
    </div>
  )
}
