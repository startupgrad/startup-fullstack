import cn from 'classnames'
import React from 'react'
import css from './styles.module.scss'

export const Alert: React.FC<{ color: 'red' | 'green'; children: React.ReactNode }> = ({ color, children }) => {
  return <div className={cn({ [css.alert]: true, [css[color]]: true })}>{children}</div>
}
