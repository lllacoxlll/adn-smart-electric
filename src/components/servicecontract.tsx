'use client'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { ContractData, contractSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn, CONTRACT_TEMPLATE } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { RefObject, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Warranty } from './warranty'
import { CustResponsibilities } from './customer-responsibilities'
import { createContract } from '@/actions/create-customerservicerequest.action'
import { Contract } from '@/types/Contract'
import Image from 'next/image'
import { updateContract } from '@/actions/update-contract.action'
import { existingCustomerQuery } from '@/actions/existing-customer.action'

type ContractFormProps = {
  employeeName: string
  contract?: Contract
  mode: 'create' | 'edit' | 'view'
}

export default function ServiceContract({ employeeName, contract, mode }: ContractFormProps) {
  const techSigCanvas = useRef<SignatureCanvas | null>(null)
  const clientSigCanvas = useRef<SignatureCanvas | null>(null)
  const [tempUrls, setTempUrls] = useState<string[]>([])

  console.log(mode)

  function accept(sigCanvas: RefObject<SignatureCanvas | null>) {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      if (sigCanvas === clientSigCanvas) {
        setValue('clientSig', 'signature_placeholder', { shouldDirty: true })
        setValue('hasClientSig', true, { shouldDirty: true })
      } else if (sigCanvas === techSigCanvas) {
        setValue('techSig', 'signature_placeholder', { shouldDirty: true })
        setValue('hasTechSig', true, { shouldDirty: true })
      }
    }
  }

  function clearImages(imageSelection: File[]) {
    if (imageSelection) {
      setValue('image', undefined, { shouldDirty: true })
      setValue('imageUrls', contract?.imageUrls || [], { shouldDirty: true })
      console.log(getValues('image'))
      console.log(getValues('imageUrls'))
      console.log(dirtyFields)
    }
  }

  function clear(sigCanvas: RefObject<SignatureCanvas | null>) {
    if (sigCanvas.current) sigCanvas.current.clear()
    if (sigCanvas === clientSigCanvas) {
      setValue('clientSig', '', { shouldDirty: true })
      setValue('hasClientSig', false, { shouldDirty: true })
    } else if (sigCanvas === techSigCanvas) {
      setValue('techSig', '', { shouldDirty: true })
      setValue('hasTechSig', false, { shouldDirty: true })
    }
  }

  const form = useForm<ContractData>({
    mode: 'onBlur',
    shouldUnregister: false,
    resolver: zodResolver(contractSchema),
    defaultValues: {
      id: contract?.id || '',
      customerName: contract?.customerName || '',
      employeeName: employeeName,
      phone: contract?.customerPhone || '',
      email: contract?.customerEmail || '',
      addressLine1: contract?.addressLine1 || '',
      addressLine2: contract?.addressLine2 || '',
      city: contract?.city || 'Spring',
      state: contract?.state || 'TX',
      zipCode: contract?.zipCode || '77379',
      country: contract?.country || 'USA',
      serviceDetails: contract?.serviceDetails || '',
      clientSig: contract?.clientSig || '',
      techSig: contract?.techSig || '',
      hasClientSig: contract?.hasClientSig || false,
      hasTechSig: contract?.hasTechSig || false,
      agreementDate: contract?.agreementDate || new Date(),
      propertyType: contract?.propertyType || 'residential',
      paymentStatus: contract?.paymentStatus || 'not paid',
      estimatedCost: contract?.estimatedCost || 0,
      deposit: contract?.deposit || 0,
      balanceDue: contract?.balanceDue || 0,
      image: undefined,
      imageUrls: contract?.imageUrls || [],
    },
  })

  const {
    formState: { dirtyFields, isDirty },
    setValue,
    getValues,
  } = form

  async function handleSubmit(contractData: ContractData) {
    console.log(dirtyFields)
    const { error } = await existingCustomerQuery(contractData.email, contractData.customerName)

    if (error) {
      toast.error(error)
      return
    }

    if (techSigCanvas.current && !techSigCanvas.current.isEmpty() && contractData.techSig !== '' && contractData.hasTechSig) {
      const canvas = techSigCanvas.current.getTrimmedCanvas()

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'))
            return
          }
          resolve(blob)
        })
      )

      const formData = new FormData()
      const currTime = new Date().toISOString().replace(/[-:.]/g, '')

      formData.append('signature', blob!, `tech-signature-${currTime}.png`)

      const signatureUploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const output = await signatureUploadResponse.json()
      contractData.techSig = output
      techSigCanvas.current!.clear()
    } else if (techSigCanvas.current && !techSigCanvas.current.isEmpty() && contractData.techSig === '' && !contractData.hasTechSig) {
      toast.error('Please confirm your signature or clear the canvas.')
      return
    }

    if (clientSigCanvas.current && !clientSigCanvas.current.isEmpty()) {
      contractData.hasClientSig = true
      contractData.clientSig = clientSigCanvas.current.toDataURL()

      const canvas = clientSigCanvas.current.getTrimmedCanvas()

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'))
            return
          }
          resolve(blob)
        })
      )

      const formData = new FormData()
      const currTime = new Date().toISOString().replace(/[-:.]/g, '')

      formData.append('signature', blob!, `client-signature-${currTime}.png`)

      const signatureUploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const output = await signatureUploadResponse.json()
      contractData.clientSig = output
      clientSigCanvas.current!.clear()
    }

    if (contractData.estimatedCost > 0 && contractData.deposit === contractData.estimatedCost) {
      contractData.paymentStatus = 'paid'
    }

    if (contractData.image) {
      const formData = new FormData()
      for (let i = 0; i < contractData.image.length; i++) {
        formData.append('image', contractData.image[i], contractData.image[i].name)
      }

      const imageUploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const output = await imageUploadResponse.json()

      contractData.imageUrls!.length = 0
      output.forEach((url: string) => {
        contractData.imageUrls!.push(url)
      })
    }

    console.log(contractData)
    console.log(dirtyFields)
    console.log(mode)

    if (mode === 'edit') {
      console.log(contractData)
      console.log(dirtyFields)

      const dirtyFieldKeys = Object.keys(dirtyFields)
      const contractDataArr = Object.entries(contractData)
      const newArr = contractDataArr.filter(([key, value]) => dirtyFieldKeys.includes(key))
      const contractDataFiles = newArr.filter(([key, value]) => ['imageUrls', 'clientSig', 'techSig'].includes(key))
      const contractDataNonFiles = newArr.filter(([key, value]) => !['imageUrls', 'clientSig', 'techSig', 'image'].includes(key))

      console.log(Object.fromEntries(newArr))
      console.log(Object.fromEntries(contractDataFiles))
      console.log(Object.fromEntries(contractDataNonFiles))
      const contractNonFiles = Object.fromEntries(contractDataNonFiles)
      const contractFiles = Object.fromEntries(contractDataFiles)

      if (contractData.id) {
        if (contractNonFiles && contractFiles) {
          const { error } = await updateContract(contractData.id, contractFiles, contractNonFiles)

          if (error) {
            toast.error(error)
          } else {
            toast.success('Contract updated successfully')
          }
        } else if (contractNonFiles) {
          const { error } = await updateContract(contractData.id, undefined, contractNonFiles)

          if (error) {
            toast.error(error)
          } else {
            toast.success('Contract updated successfully')
          }
        } else if (contractFiles) {
          const { error } = await updateContract(contractData.id, contractFiles, undefined)

          if (error) {
            toast.error(error)
          } else {
            toast.success('Contract updated successfully')
          }
        }
      }
    } else if (mode === 'create') {
      console.log(dirtyFields)
      console.log(contractData)
      const { error } = await createContract(contractData)

      if (error) {
        toast.error(error)
      } else {
        toast.success('Contract created successfully')
      }

      form.reset()
    }
  }

  return (
    <Card className="w-full mx-auto my-8 p-16">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col gap-14">
          <CardTitle className="text-3xl">{CONTRACT_TEMPLATE.companyDetails.companyName.name}</CardTitle>

          <CardDescription className="text-xl">{CONTRACT_TEMPLATE.header}</CardDescription>
        </div>

        <div className="text-gray-600">
          <div className="flex justify-between">
            {CONTRACT_TEMPLATE.companyDetails.companyName.label}
            <div className="underline">{CONTRACT_TEMPLATE.companyDetails.companyName.name}</div>
          </div>
          <div className="flex justify-between">
            {CONTRACT_TEMPLATE.companyDetails.companyLicense.label}
            <div className="underline">{CONTRACT_TEMPLATE.companyDetails.companyLicense.license}</div>
          </div>
          <div className="flex justify-between">
            {CONTRACT_TEMPLATE.companyDetails.companyAddress.label}
            <div className="underline">{CONTRACT_TEMPLATE.companyDetails.companyAddress.address}</div>
          </div>
          <div className="flex justify-between">
            {CONTRACT_TEMPLATE.companyDetails.companyPhone.label}
            <div className="underline">{CONTRACT_TEMPLATE.companyDetails.companyPhone.phone}</div>
          </div>
          <div className="flex justify-between">
            {CONTRACT_TEMPLATE.companyDetails.companyEmail.label}
            <div className="underline">{CONTRACT_TEMPLATE.companyDetails.companyEmail.email}</div>
          </div>
        </div>
      </div>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-8">
            <p className="font-bold text-2xl">1. Parties</p>
            <p>
              This Electrical Service Agreement (“Agreement”) is made between: <br />
              Contractor: ADN Smart Electric LLC (“Contractor”), a licensed Texas electrical contracting company, and
            </p>
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <FormLabel className="text-md">Customer:</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input placeholder="Customer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                    (“Customer”)
                  </div>
                </FormItem>
              )}
            />
            This Agreement governs the electrical services described below.
            <p className="font-bold text-2xl">2. Service Location & Description</p>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-20">
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4 flex-col sm:flex-row">
                      <FormLabel className="text-md">Service Address Line 1:</FormLabel>
                      <FormControl className="w-[50%]">
                        <Input placeholder="Address Line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <FormLabel className="text-md">Service Address Line 2:</FormLabel>
                      <FormControl className="w-[50%]">
                        <Input placeholder="Address Line 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <FormLabel className="text-md">City:</FormLabel>
                      <FormControl className="w-[50%]">
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <FormLabel className="text-md">State:</FormLabel>
                      <FormControl className="w-[50%]">
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <FormLabel className="text-md">Zip Code:</FormLabel>
                      <FormControl className="w-[50%]">
                        <Input placeholder="Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <FormLabel className="text-md">Country:</FormLabel>
                      <FormControl className="w-[50%]">
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <FormLabel className="text-md">Phone:</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <FormLabel className="text-md">Email:</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Type of Property:</FormLabel>
                    <FormControl className="w-[50%] flex">
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                        <FormItem className="flex items-center">
                          <FormControl>
                            <RadioGroupItem value="residential" />
                          </FormControl>
                          <FormLabel>Residential</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center">
                          <FormControl>
                            <RadioGroupItem value="commercial" />
                          </FormControl>
                          <FormLabel>Commercial</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceDetails"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Description of Work / Scope of Services:</FormLabel>
                    <FormControl className="w-[50%]">
                      <Textarea placeholder="Service Details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedCost"
              render={({ field }) => (
                <FormItem>
                  <p className="font-bold text-2xl">3. Estimated Cost and Terms of Payment</p>
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Estimated Cost: $</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input type="number" {...field} placeholder="" onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </div>
                  (subject to change based on approved modifications)
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Deposit (if any): $</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input type="number" {...field} placeholder="" onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balanceDue"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Balance Due: $</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input type="number" {...field} placeholder="" onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <span className="font-bold">Payment Terms:</span>
            {CONTRACT_TEMPLATE.costDetails}
            <p className="font-bold text-2xl">4. Change Orders</p>
            <div>{CONTRACT_TEMPLATE.changeOrders}</div>
            <p className="font-bold text-2xl">5. Code Compliance & Permits</p>
            <div>{CONTRACT_TEMPLATE.compliance}</div>
            <Warranty />
            <p className="font-bold text-2xl">7. Limitation of Liability</p>
            <div>{CONTRACT_TEMPLATE.liability}</div>
            <CustResponsibilities />
            <p className="font-bold text-2xl">9. Right to Cancel (Residential Only)</p>
            <div>{CONTRACT_TEMPLATE.cancelRights}</div>
            <p className="font-bold text-2xl">10. Dispute Resolution and Governing Law</p>
            <div>{CONTRACT_TEMPLATE.dispute}</div>
            <p className="font-bold text-2xl">11. Entire Agreement</p>
            <div>{CONTRACT_TEMPLATE.summary}</div>
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <p className="font-bold text-2xl">12. Acceptance and Signatures</p>
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Customer Name (printed):</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input placeholder="Customer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            Customer Name (signed):
            <div className="flex flex-col gap-4">
              {mode === 'view' || contract?.hasClientSig ? (
                <FormField control={form.control} name="clientSig" render={({ field }) => <FormItem>{field.value && <Image src={field.value} width={300} height={300} alt="client signature" />}</FormItem>} />
              ) : (
                <>
                  <SignatureCanvas ref={clientSigCanvas} canvasProps={{ className: 'outline-solid w-[70%]' }} />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="default" variant="default" type="button" onClick={() => clear(clientSigCanvas)}>
                      Clear Signature
                    </Button>

                    <Button size="default" type="button" onClick={() => accept(clientSigCanvas)} className="bg-green-600">
                      Confirm Signature
                    </Button>
                  </div>
                </>
              )}
            </div>
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Technician Name (printed):</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input placeholder="Technician Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            Technician Name (signed):
            <div className="flex flex-col gap-4">
              {mode === 'view' || contract?.hasTechSig ? (
                <FormField control={form.control} name="techSig" render={({ field }) => <FormItem>{field.value && <Image src={field.value} width={300} height={300} alt="tech signature" />}</FormItem>} />
              ) : (
                <>
                  <SignatureCanvas ref={techSigCanvas} canvasProps={{ className: 'outline-solid w-[70%]' }} />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="default" variant="default" type="button" onClick={() => clear(techSigCanvas)}>
                      Clear Signature
                    </Button>

                    <Button size="default" type="button" onClick={() => accept(techSigCanvas)} className="bg-green-600">
                      Confirm Signature
                    </Button>
                  </div>
                </>
              )}
            </div>
            <FormField
              control={form.control}
              name="agreementDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex gap-2 flex-col sm:flex-row items-baseline">
                    <FormLabel className="text-md">Agreement Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="w-[50%]">
                          <Button variant={'outline'} className={cn('w-[240px]) pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <div className="flex gap-2 flex-col items-baseline">
                    <FormLabel className="text-md">Image Upload (Optional):</FormLabel>
                    <FormControl className="w-[50%]">
                      <Input
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        type="file"
                        multiple
                        capture="environment"
                        onChange={(event) => {
                          if (value) {
                            onChange(event.target.files && [...value, ...Array.from(event.target.files)])
                          } else {
                            onChange(event.target.files && Array.from(event.target.files))
                          }

                          setTempUrls(getValues('image')!.map((fileObj) => URL.createObjectURL(fileObj)))

                          setValue('imageUrls', ['_temp_image_url_'], { shouldDirty: true })
                        }}
                      />
                    </FormControl>
                    <Button size="default" type="button" onClick={() => clearImages(value!)} disabled={value === undefined}>
                      Clear Image Selection
                    </Button>
                    <FormMessage />
                    {console.log(dirtyFields)!}
                    {contract?.imageUrls !== undefined && (
                      <div className="sm:flex sm:flex-row sm:flex-wrap">
                        {contract.imageUrls.map((url) => (
                          <Image key={url} src={url} alt="existing images" width={300} height={300} />
                        ))}
                      </div>
                    )}

                    {tempUrls && (
                      <div className="sm:flex sm:flex-row sm:flex-wrap">
                        {tempUrls.map((url) => (
                          <Image key={url} src={url} alt="images to upload" width={300} height={300} />
                        ))}
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={!isDirty} className="w-[20%]" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
