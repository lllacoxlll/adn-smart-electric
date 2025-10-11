import { formSchema } from '@/lib/schemas'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/brevo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = formSchema.parse(body)

    const name = validatedData.first + ' ' + validatedData.last
    const recipientEmail = 'gallardoelectric.services@gmail.com'
    const sender = 'gallardoelectricappuser@gmail.com'
    const subject = 'New Contact Request'
    const htmlContent = `<div>${validatedData.message}</div>`
    const replyToEmail = validatedData.email
    const replyToName = name

    const { error } = await sendEmail({recipientEmail, sender, name, subject, htmlContent, replyToEmail, replyToName})

    if (!error) {
      return NextResponse.json({ res: 'Form submitted successfully', data: validatedData })
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
