'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface brevoEmailParams {
  recipientEmail: string
  sender: string
  name: string
  subject: string
  htmlContent: string
  replyToEmail: string
}

export async function sendEmail({ recipientEmail, sender, name, subject, htmlContent, replyToEmail }: brevoEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${name} <${sender}>`,
      to: recipientEmail,
      replyTo: replyToEmail,
      subject: subject,
      html: htmlContent,
    })

    return { data, error }

  }
  catch (err) {
    throw err
  }
}
