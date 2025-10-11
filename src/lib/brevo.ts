// import axios from 'axios'
import * as Brevo from '@getbrevo/brevo'

const apiInstance = new Brevo.TransactionalEmailsApi()
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

interface brevoEmailParams {
  recipientEmail: string
  sender: string
  name: string
  subject: string
  htmlContent: string
  replyToEmail: string
  replyToName: string
}

export async function sendEmail({ recipientEmail, sender, name, subject, htmlContent, replyToEmail, replyToName }: brevoEmailParams) {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.sender = { email: sender, name: name }
    sendSmtpEmail.to = [{ email: recipientEmail }]
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = htmlContent
    const replyToClass = new Brevo.SendSmtpEmailReplyTo()
    replyToClass.email = replyToEmail
    replyToClass.name = replyToName
    sendSmtpEmail.replyTo = replyToClass

    await apiInstance.sendTransacEmail(sendSmtpEmail)

    return { error: null }
  } catch (error) {
    return { error }
  }
}
