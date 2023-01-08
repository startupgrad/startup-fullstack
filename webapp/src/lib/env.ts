import { z } from 'zod'

export const zEnv = z.object({
  VITE_BACKEND_URL: z.string().trim().min(1),
})

// eslint-disable-next-line no-restricted-syntax
export const env = zEnv.parse(import.meta.env)
