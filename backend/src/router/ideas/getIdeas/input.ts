import { z } from 'zod'

export const zGetIdeasInput = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
})
