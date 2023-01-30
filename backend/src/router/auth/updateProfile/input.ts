import { zNickRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zUpdateProfileInput = z.object({
  nick: zNickRequired,
  name: z.string().max(50).default(''),
})
