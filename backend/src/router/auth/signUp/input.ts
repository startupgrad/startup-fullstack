import { zEmailRequired, zNickRequired, zStringRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zSignUpInput = z.object({
  nick: zNickRequired,
  email: zEmailRequired,
  password: zStringRequired,
})
