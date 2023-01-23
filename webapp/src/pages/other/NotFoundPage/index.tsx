import image404 from '../../../assets/images/404.png'
import { ErrorPageComponent } from '../../../components/ErrorPageComponent'
import css from './styles.module.scss'

export const NotFoundPage: React.FC<{ title?: string; message?: string }> = ({
  title = 'Not Found',
  message = 'This page does not exist',
}) => (
  <ErrorPageComponent title={title} message={message}>
    <img className={css.image} src={image404} width="1000" height="1000" alt="" />
  </ErrorPageComponent>
)
