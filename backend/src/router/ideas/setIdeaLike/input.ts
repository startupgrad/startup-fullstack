import { z } from 'zod'

export const zSetIdeaLikeIdeaInput = z.object({
  ideaId: z.string().min(1),
  isLikedByMe: z.boolean(),
})
