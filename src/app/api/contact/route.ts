import { formSchema } from '@/lib/schemas'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = formSchema.parse(body)

    const name = validatedData.first + ' ' + validatedData.last
    const recipientEmail = process.env.ADMIN_SENDER_EMAIL!
    const sender = process.env.USER_SENDER_EMAIL!
    const subject = `New Contact Request`
    const htmlContent = `<div>${validatedData.message}</div>`
    const replyToEmail = validatedData.email

    const { data, error } = await sendEmail({ recipientEmail, sender, name, subject, htmlContent, replyToEmail })

    if (!error) {
      return NextResponse.json({ res: 'Form submitted successfully', data: data, validatedData: validatedData })
    }
    else {
      throw error
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    else if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json({ error: error }, { status: 500 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
