import fs from 'fs'
import path from 'path'
import { getNewIdeaRoute, getViewIdeaRoute } from '@ideanick/webapp/src/lib/routes'
import { Idea, User } from '@prisma/client'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { env } from './env'
import { logger } from './logger'
import { sendEmailThroughMailgun } from './mailgun'

const getHbrTemplates = _.memoize(() => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/dist/**/*.html')
  const htmlPaths = fg.sync(htmlPathsPattern)
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {}
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html')
    const htmlTemplate = fs.readFileSync(htmlPath, 'utf8')
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate)
  }
  return hbrTemplates
})

const getEmailHtml = (templateName: string, templateVariables: Record<string, string> = {}) => {
  return getHbrTemplates()[templateName](templateVariables)
}

const sendEmail = async ({
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
  const fullTemplateVaraibles = {
    ...templateVariables,
    homeUrl: env.WEBAPP_URL,
  }
  const html = getEmailHtml(templateName, fullTemplateVaraibles)
  logger.info('email', 'Sending email', {
    to,
    templateName,
    templateVariables,
  })
  return await sendEmailThroughMailgun({ to, html, subject })
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks For Registration!',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: getNewIdeaRoute({ abs: true }),
    },
  })
}

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, 'email'>; idea: Pick<Idea, 'nick'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Your Idea Blocked!',
    templateName: 'idea-blocked',
    templateVariables: {
      ideaNick: idea.nick,
    },
  })
}

export const sendMostLikedIdeasEmail = async ({
  user,
  ideas,
}: {
  user: Pick<User, 'email'>
  ideas: Array<Pick<Idea, 'nick' | 'name'>>
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Most Liked Ideas!',
    templateName: 'most-liked-ideas',
    templateVariables: {
      ideas: ideas.map((idea) => ({ name: idea.name, url: getViewIdeaRoute({ abs: true, ideaNick: idea.nick }) })),
    },
  })
}
