import { zStringRequired } from '@ideanick/shared/src/zod'
import { zCreateIdeaInput } from '../createIdea/input'

export const zUpdateIdeaInput = zCreateIdeaInput.extend({
  ideaId: zStringRequired,
})
