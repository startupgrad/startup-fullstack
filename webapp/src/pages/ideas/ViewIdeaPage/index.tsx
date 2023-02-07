import type { TrpcRouterOutput } from '@ideanick/backend/src/router'
import { canBlockIdeas, canEditIdea } from '@ideanick/backend/src/utils/can'
import { getAvatarUrl, getCloudinaryUploadUrl } from '@ideanick/shared/src/cloudinary'
import ImageGallery from 'react-image-gallery'
import { useParams } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { LinkButton, Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Icon } from '../../../components/Icon'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { ViewIdeaRouteParams, getEditIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import css from './styles.module.scss'

const LikeButton: React.FC<{ idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }> = ({ idea }) => {
  const trpcUtils = trpc.useContext()
  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getIdea.getData({ ideaNick: idea.nick })
      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, newGetIdeaData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getIdea.invalidate({ ideaNick: idea.nick })
    },
  })
  return (
    <button
      className={css.likeButton}
      onClick={(e) => {
        e.preventDefault()
        void setIdeaLike.mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
      }}
    >
      <Icon size={32} className={css.likeIcon} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </button>
  )
}

const BlockIdea: React.FC<{ idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }> = ({ idea }) => {
  const blockIdea = trpc.blockIdea.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await trpcUtils.getIdea.refetch({ ideaNick: idea.nick })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block Idea
        </Button>
      </FormItems>
    </form>
  )
}

export const ViewIdeaPage = withPageWrapper({
  title: ({ queryResult }) => queryResult.data.idea?.name,
  useQuery: () => {
    const { ideaNick } = useParams() as ViewIdeaRouteParams
    return trpc.getIdea.useQuery({
      ideaNick,
    })
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    idea: checkExists(queryResult.data.idea, 'Idea not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
})(({ idea, me }) => (
  <Segment title={idea.name} description={idea.description}>
    <div className={css.author}>
      <img className={css.avatar} alt="" src={getAvatarUrl(idea.author.avatar, 'small')} />
      <div className={css.name}>
        Author:
        <br />
        {idea.author.nick}
        {idea.author.name ? ` (${idea.author.name})` : ''}
      </div>
    </div>
    {!!idea.images.length && (
      <div className={css.gallery}>
        <ImageGallery
          showPlayButton={false}
          showFullscreenButton={false}
          items={idea.images.map((image) => ({
            original: getCloudinaryUploadUrl(image, 'image', 'large'),
            thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
          }))}
        />
      </div>
    )}
    <div className={css.text} dangerouslySetInnerHTML={{ __html: idea.text }} />
    <div className={css.likes}>
      Likes: {idea.likesCount}
      {me && (
        <>
          <br />
          <LikeButton idea={idea} />
        </>
      )}
    </div>
    {canEditIdea(me, idea) && (
      <div className={css.editButton}>
        <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
      </div>
    )}
    {canBlockIdeas(me) && (
      <div className={css.blockIdea}>
        <BlockIdea idea={idea} />
      </div>
    )}
  </Segment>
))
