import { zStringRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zSetIdeaLikeIdeaInput = z.object({
  ideaId: zStringRequired,
  isLikedByMe: z.boolean(),
})
