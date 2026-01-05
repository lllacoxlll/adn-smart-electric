import { z } from 'zod'

export const createEmployeeSchema = z.object({
  email: z.email('Please provide a valid address.'),
  password: z.string().min(8, 'Password must be 8 or more characters.').max(128, 'Password maximum length exceeded.'),
  name: z.string().min(1, "Please enter employee's full name."),
})

export type EmployeeData = z.infer<typeof createEmployeeSchema>

export const formSchema = z.object({
  first: z.string().min(1, 'Please enter your first name.'),
  last: z.string().min(1, 'Please enter your last name.'),
  email: z.email('Please provide a valid address.'),
  message: z.string().min(1, 'Please provide a short message here.'),
})

export type FormData = z.infer<typeof formSchema>

const MAX_FILE_SIZE = 5000000

const ACCEPTED_IMAGE_TYPES = ['image/heif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const contractSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(1, "Please enter the customer's full name."),
  employeeName: z.string().min(1, 'Please enter your full name.'),
  phone: z
    .string()
    .min(1, "Please the customer's phone number.")
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Please enter a valid phone number (XXX-XXX-XXXX).'),
  email: z.email("Please enter the customer's email."),
  addressLine1: z.string().min(1, 'Please enter the service address.'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'Please enter the city.'),
  state: z.string().min(1, 'Please enter the state.'),
  zipCode: z.string().min(1, 'Please enter the zip code.').regex(/\d{5}/),
  country: z.string().min(1, 'Please enter the country.'),
  serviceDetails: z.string().min(1, 'Please enter valid service details.'),
  clientSig: z.string(),
  techSig: z.string(),
  hasClientSig: z.boolean(),
  hasTechSig: z.boolean(),
  agreementDate: z.date(),
  propertyType: z.enum(['residential', 'commercial']),
  paymentStatus: z.enum(['paid', 'not paid', 'processing']),
  estimatedCost: z.coerce.number<number>(),
  deposit: z.coerce.number<number>(),
  balanceDue: z.coerce.number<number>(),
  image: z
    .array(z.instanceof(File))
    .refine((files) => {
      return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type))
    }, 'Only .heif, .jpg, .jpeg, .png, and .webp formats are supported.')
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), 'Max file size allowed is 5MB.')
    .optional(),
  imageUrls: z.array(z.string()).optional(),
})

export type ContractData = z.infer<typeof contractSchema>
