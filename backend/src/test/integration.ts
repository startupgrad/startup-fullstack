import { Idea, User } from '@prisma/client'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { createAppContext } from '../lib/ctx'
import { getTrpcContext } from '../lib/trpc'
import { trpcRouter } from '../router'
import { getPasswordHash } from '../utils/getPasswordHash'

export const appContext = createAppContext()

afterAll(appContext.stop)

beforeEach(async () => {
  await appContext.prisma.ideaLike.deleteMany()
  await appContext.prisma.idea.deleteMany()
  await appContext.prisma.user.deleteMany()
})

export const getTrpcCaller = (user?: User) => {
  return trpcRouter.createCaller(getTrpcContext(appContext, user))
}

export const withoutNoize = (input: any): any => {
  if (_.isArray(input)) {
    return input.map((item) => withoutNoize(item))
  }
  if (_.isObject(input)) {
    return _.entries(input).reduce((acc, [key, value]: [string, any]) => {
      if ([/^id$/, /Id$/, /At$/].some((regex) => regex.test(key))) {
        return acc
      }
      return {
        ...acc,
        [key]: withoutNoize(value),
      }
    }, {})
  }
  return input
}

export const createUser = async ({ user = {}, number = 1 }: { user?: Partial<User>; number?: number } = {}) => {
  return await appContext.prisma.user.create({
    data: {
      nick: `user${number}`,
      email: `user${number}@example.com`,
      password: getPasswordHash(user.password || '1234'),
      ..._.omit(user, ['password']),
    },
  })
}

export const createIdea = async ({
  idea = {},
  author,
  number = 1,
}: {
  idea?: Partial<Idea>
  author: Pick<User, 'id'>
  number?: number
}) => {
  return await appContext.prisma.idea.create({
    data: {
      nick: `idea${number}`,
      authorId: author.id,
      name: `Idea ${number}`,
      description: `Idea ${number} description`,
      text: `Idea ${number} text text text text text text text text text text text text text text text text text text text text text`,
      ...idea,
    },
  })
}

export const createIdeaWithAuthor = async ({
  author,
  idea,
  number,
}: {
  author?: Partial<User>
  idea?: Partial<Idea>
  number?: number
} = {}) => {
  const createdUser = await createUser({ user: author, number })
  const createdIdea = await createIdea({ idea, author: createdUser, number })
  return {
    author: createdUser,
    idea: createdIdea,
  }
}

export const createIdeaLike = async ({
  idea,
  liker,
  createdAt,
}: {
  idea: Pick<Idea, 'id'>
  liker: Pick<User, 'id'>
  createdAt?: DateTime
}) => {
  return await appContext.prisma.ideaLike.create({
    data: {
      ideaId: idea.id,
      userId: liker.id,
      createdAt: createdAt?.toJSDate(),
    },
  })
}
