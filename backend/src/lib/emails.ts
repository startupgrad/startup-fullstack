import fs from 'fs'
import path from 'path'
import { Idea, User } from '@prisma/client'
import fg from 'fast-glob'
import _ from 'lodash'
import { env } from './env'

const getHtmlTemplates = _.memoize(() => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/dist/**/*.html')
  const htmlPaths = fg.sync(htmlPathsPattern)
  const htmlTemplates: Record<string, string> = {}
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html')
    htmlTemplates[templateName] = fs.readFileSync(htmlPath, 'utf8')
  }
  return htmlTemplates
})

const getHtmlTemplate = (templateName: string) => {
  return getHtmlTemplates()[templateName]
}

const sendEmail = ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string
  subject: string
  templateName: string
  templateVariables?: Record<string, any>
}) => {
  const htmlTemplate = getHtmlTemplate(templateName)
  const fullTemplateVaraibles = {
    ...templateVariables,
    homeUrl: env.WEBAPP_URL,
  }
  console.info('sendEmail', {
    to,
    subject,
    templateName,
    fullTemplateVaraibles,
    htmlTemplate,
  })
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return sendEmail({
    to: user.email,
    subject: 'Thanks For Registration!',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${env.WEBAPP_URL}/ideas/new`,
    },
  })
}

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, 'email'>; idea: Pick<Idea, 'nick'> }) => {
  return sendEmail({
    to: user.email,
    subject: 'Your Idea Blocked!',
    templateName: 'idea-blocked',
    templateVariables: {
      ideaNick: idea.nick,
    },
  })
}
