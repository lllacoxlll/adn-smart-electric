import { z } from "zod"

export const formSchema = z.object({
  first: z.string().min(1, 'Please enter your first name.'),
  last: z.string().min(1, 'Please enter your last name.'),
  email: z.email('Please provide a valid address.'),
  message: z.string().min(1, 'Please provide a short message here.'),
})

export type FormData = z.infer<typeof formSchema>