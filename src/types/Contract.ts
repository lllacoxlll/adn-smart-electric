export type Contract = {
  id: string,
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  serviceDetails: string,
  hasClientSig: boolean,
  hasTechSig: boolean,
  agreementDate?: Date,
  completionDate?: Date,
  propertyType: 'residential' | 'commercial',
  estimatedCost: number,
  paymentStatus: 'paid' | 'not paid' | 'processing',
  deposit: number,
  balanceDue: number,
  customerEmail: string,
  customerName: string,
  customerPhone: string,
  imageUrls?: string[],
  clientSig?: string,
  techSig?: string,
}
