import { z } from 'zod'
import { zCreateIdeaInput } from '../createIdea/input'

export const zUpdateIdeaInput = zCreateIdeaInput.extend({
  ideaId: z.string().min(1),
})
