import { zNickRequired, zStringMin, zStringRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zCreateIdeaInput = z.object({
  name: zStringRequired,
  nick: zNickRequired,
  description: zStringRequired,
  text: zStringMin(100),
  images: z.array(zStringRequired),
  documents: z.array(zStringRequired),
  certificate: z.string().nullable(),
})
