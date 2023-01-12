import { ErrorPageComponent } from '../../components/ErrorPageComponent'

export const NotFoundPage: React.FC<{ title?: string; message?: string }> = ({
  title = 'Not Found',
  message = 'This page does not exist',
}) => <ErrorPageComponent title={title} message={message} />
