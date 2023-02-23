import { z } from 'zod'

export const zSignInInput = z.object({
  nick: z.string().min(1),
  password: z.string().min(1),
})
