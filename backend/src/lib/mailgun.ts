import formData from 'form-data'
import _ from 'lodash'
import Mailgun from 'mailgun.js'
import { env } from './env'

const getMailgunClient = _.memoize(() => {
  const mailgun = new Mailgun(formData)
  return mailgun.client({ username: 'api', key: env.MAILGUN_API_KEY, url: 'https://api.eu.mailgun.net' })
})

export const sendEmailThroughMailgun = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  const mg = getMailgunClient()
  return await mg.messages.create(env.MAILGUN_DOMAIN, {
    from: `${env.FROM_EMAIL_NAME} <${env.FROM_EMAIL_ADDRESS}>`,
    to: [to],
    subject,
    html,
  })
}
