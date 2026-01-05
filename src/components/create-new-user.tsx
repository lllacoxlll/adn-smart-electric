'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { createUserAction } from '@/actions/create-user.action'
import { createEmployeeSchema, EmployeeData } from '@/lib/schemas'

export const CreateUserForm = () => {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<EmployeeData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  async function handleSubmit(data: EmployeeData) {
    setIsPending(true)
    try {
      const { error } = await createUserAction(data)

      if (error) {
        throw error
      }

      toast.success('New User created successfully')

      setIsPending(false)
    } catch (error) {
      if (typeof error === 'string') {
        toast.error(error)
      } else {
        toast.error('An unknown error occurred.')
      }

      setIsPending(false)
    }
    form.reset()
  }

  return (
    <Card className="w-full max-w-sm mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-xl">Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="employee@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Last" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
