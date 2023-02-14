import fs from 'fs'
import path from 'path'
import express, { Express } from 'express'
import { env } from './env'
import { logger } from './logger'

const findWebappDistDir = (dir: string): string | null => {
  const maybeWebappDistDir = path.resolve(dir, 'webapp/dist')
  if (fs.existsSync(maybeWebappDistDir)) {
    return maybeWebappDistDir
  }
  if (dir === '/') {
    return null
  }
  return findWebappDistDir(path.dirname(dir))
}

export const applyServeWebApp = (expressApp: Express): void => {
  const webappDistDir = findWebappDistDir(__dirname)
  if (!webappDistDir) {
    if (env.HOST_ENV === 'production') {
      throw new Error('Webapp dist dir not found')
    } else {
      logger.error('webapp-serve', 'Webapp dist dir not found')
      return
    }
  }

  const htmlSource = fs.readFileSync(path.resolve(webappDistDir, 'index.html'), 'utf8')

  expressApp.use(express.static(webappDistDir, { index: false }))
  expressApp.get('/*', (req, res) => {
    res.send(htmlSource)
  })
}
