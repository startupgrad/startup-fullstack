import { Alert } from '../Alert'
import { Segment } from '../Segment'

export const ErrorPageComponent: React.FC<{ title?: string; message?: string }> = ({
  title = 'Oops, error',
  message = 'Something went wrong',
}) => {
  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
    </Segment>
  )
}
