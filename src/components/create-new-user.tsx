'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
// import { useRouter } from 'next/navigation'
import { createUserAction } from '@/actions/create-user.action'

export const CreateUserForm = () => {

  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    setIsPending(true)

    const formData = new FormData(evt.target as HTMLFormElement)

    const { error } = await createUserAction(formData)

    if (error) {
      toast.error(error)
      setIsPending(false)
    } else {
      toast.success('User created successfully')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full my-20 space-y-4">
      <fieldset>
        <legend className="my-4 text-xl font-bold">Create New Employee</legend>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" />
        </div>
        <div className="my-4 space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" name="name" />
        </div>
      </fieldset>

      <Button type="submit" className="w-full" disabled={isPending}>
        Create User
      </Button>
    </form>
  )
}
