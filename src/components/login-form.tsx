"use client"

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signInEmailActon } from '@/actions/sign-in-email.action'

export const LoginForm = () => {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    setIsPending(true)

    const formData = new FormData(evt.target as HTMLFormElement)

    const { error } = await signInEmailActon(formData)

    if (error) {
      toast.error(error)
      setIsPending(false)
    } else {
      toast.success("Login successful")
      router.push("/profile")
    }

  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        Login
      </Button>
    </form>
  )
}
