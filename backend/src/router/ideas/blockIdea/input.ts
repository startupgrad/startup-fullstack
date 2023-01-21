import { z } from 'zod'

export const zBlockIdeaInput = z.object({
  ideaId: z.string().min(1),
})
