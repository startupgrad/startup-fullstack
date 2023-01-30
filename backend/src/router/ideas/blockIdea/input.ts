import { zStringRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zBlockIdeaInput = z.object({
  ideaId: zStringRequired,
})
