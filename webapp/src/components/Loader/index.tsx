import cn from 'classnames'
import React from 'react'
import css from './styles.module.scss'

export const Loader: React.FC<{ type: 'page' | 'section' }> = ({ type }) => (
  <span
    className={cn({
      [css.loader]: true,
      [css[`type-${type}`]]: true,
    })}
  />
)
