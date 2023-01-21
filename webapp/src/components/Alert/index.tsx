import cn from 'classnames'
import React from 'react'
import css from './styles.module.scss'

export type AlertProps = { color: 'red' | 'green' | 'brown'; hidden?: boolean; children: React.ReactNode }
export const Alert: React.FC<AlertProps> = ({ color, hidden, children }) => {
  if (hidden) {
    return null
  }
  return <div className={cn({ [css.alert]: true, [css[color]]: true })}>{children}</div>
}
