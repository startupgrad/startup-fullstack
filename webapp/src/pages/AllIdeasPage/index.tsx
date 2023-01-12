import { Link } from 'react-router-dom'
import { Segment } from '../../components/Segment'
import { withPageWrapper } from '../../lib/pageWrapper'
import { getViewIdeaRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import css from './styles.module.scss'

export const AllIdeasPage = withPageWrapper({
  useQuery: () => trpc.getIdeas.useQuery(),
  setProps: ({ queryResult }) => ({ ideas: queryResult.data.ideas }),
})(({ ideas }) => {
  return (
    <Segment title="All Ideas">
      <div className={css.ideas}>
        {ideas.map((idea) => (
          <div className={css.idea} key={idea.nick}>
            <Segment
              size={2}
              title={
                <Link className={css.ideaLink} to={getViewIdeaRoute({ ideaNick: idea.nick })}>
                  {idea.name}
                </Link>
              }
              description={idea.description}
            />
          </div>
        ))}
      </div>
    </Segment>
  )
})
