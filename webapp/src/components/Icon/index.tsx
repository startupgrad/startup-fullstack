import { createElement } from 'react'
import { IconBaseProps } from 'react-icons'
import { AiFillHeart, AiOutlineHeart, AiFillCloseCircle } from 'react-icons/ai'

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: AiFillCloseCircle,
}

export const Icon: React.FC<{ name: keyof typeof icons } & IconBaseProps> = ({ name, ...restProps }) => {
  return createElement(icons[name], restProps)
}
