import { zStringOptional } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zGetIdeasInput = z.object({
  cursor: zStringOptional,
  limit: z.number().min(1).max(100).default(10),
  search: zStringOptional,
})
