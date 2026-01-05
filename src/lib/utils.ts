import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CONTRACT_TEMPLATE = {
  header: 'Electrical Service Agreement (Customer Form)',
  companyDetails: {
    companyName: { label: 'Company Name: ', name: 'ADN Smart Electric LLC' },
    companyAddress: { label: 'Business Address: ', address: '6907 White Tail Dr.' },
    companyEmail: { label: 'Email: ', email: process.env.ADMIN_SENDER_EMAIL },
    companyOwner: { label: 'Owner: ', owner: 'Adan Gallardo' },
    companyLicense: { label: 'Texas Electrical Contractor License #: ', license: '1234557' },
    companyPhone: { label: 'Phone: ', phone: '713-820-5982' },
  },
  costDetails: ` Payment is due immediately upon completion of services unless otherwise specified in writing. Late payments may incur interest at 1.5% per month (18% annual). Invoices may be sent electronically and are payable via cash, check, or approved digital payment method.`,
  changeOrders: 'Any changes to the original scope of work must be documented in writing and signed or electronically approved by both the Customer and the Contractor (or authorized employee). Additional work may result in additional charges.',
  compliance: 'All work will be performed in compliance with the National Electrical Code (NEC) and local jurisdictional requirements. ADN Smart Electric LLC will obtain necessary permits unless otherwise agreed in writing.',
  liability: 'In no event shall Contractor be liable for incidental or consequential damages beyond the cost of the services provided. Contractor is not responsible for pre-existing issues, concealed conditions, or unrelated system failures.',
  cancelRights: `You, the Customer, may cancel this contract without penalty within three (3) business days after signing if the sale was made at your residence. To cancel, sign and date a written notice and deliver or mail it to ADN Smart Electric LLC at the address above before midnight of the third business day.`,
  dispute: `Any dispute arising from this Agreement shall first be attempted to be resolved through good-faith negotiation.

  If unresolved, both parties agree to binding arbitration in Harris County, Texas, under Texas law.

  This Agreement is governed by the laws of the State of Texas.`,
  summary: `This document represents the entire understanding between the parties. No other oral or written agreements are binding unless signed by both parties.`,
} as const