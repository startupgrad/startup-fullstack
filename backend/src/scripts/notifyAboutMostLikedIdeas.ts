import { Idea } from '@prisma/client'
import { AppContext } from '../lib/ctx'
import { sendMostLikedIdeasEmail } from '../lib/emails'

export const getMostLikedIdeas = async (ctx: AppContext, limit: number = 10) => {
  return await ctx.prisma.$queryRaw<Array<Pick<Idea, 'id' | 'nick' | 'name'> & { thisMonthLikesCount: number }>>`
    with "topIdeas" as (
      select id,
        nick,
        name,
        (
          select count(*)::int
          from "IdeaLike" il
          where il."ideaId" = i.id
            and il."createdAt" > now() - interval '1 month'
            and i."blockedAt" is null
        ) as "thisMonthLikesCount"
      from "Idea" i
      order by "thisMonthLikesCount" desc
      limit ${limit}
    )
    select *
    from "topIdeas"
    where "thisMonthLikesCount" > 0
`
}

export const notifyAboutMostLikedIdeas = async (ctx: AppContext) => {
  const mostLikedIdeas = await getMostLikedIdeas(ctx)
  if (!mostLikedIdeas.length) {
    return
  }
  const users = await ctx.prisma.user.findMany({
    select: {
      email: true,
    },
  })
  await Promise.all(users.map(async (user) => await sendMostLikedIdeasEmail({ user, ideas: mostLikedIdeas })))
}
