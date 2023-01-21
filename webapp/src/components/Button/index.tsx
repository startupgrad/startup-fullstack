import cn from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import css from './styles.module.scss'

type ButtonColor = 'red' | 'green'
export type ButtonProps = { loading?: boolean; children: React.ReactNode; color?: ButtonColor }
export const Button: React.FC<ButtonProps> = ({ children, loading = false, color = 'green' }) => {
  return (
    <button
      className={cn({
        [css.button]: true,
        [css[`color-${color}`]]: true,
        [css.disabled]: loading,
        [css.loading]: loading,
      })}
      type="submit"
      disabled={loading}
    >
      <span className={css.text}>{children}</span>
    </button>
  )
}

export const LinkButton: React.FC<{
  children: React.ReactNode
  to: string
  color?: ButtonColor
}> = ({ children, to, color = 'green' }) => {
  return (
    <Link className={cn({ [css.button]: true, [css[`color-${color}`]]: true })} to={to}>
      {children}
    </Link>
  )
}
