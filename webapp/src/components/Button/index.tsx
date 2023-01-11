import cn from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import css from './styles.module.scss'

export type ButtonProps = { loading?: boolean; children: React.ReactNode }
export const Button: React.FC<ButtonProps> = ({ children, loading = false }) => {
  return (
    <button className={cn({ [css.button]: true, [css.disabled]: loading })} type="submit" disabled={loading}>
      {loading ? 'Submitting...' : children}
    </button>
  )
}

export const LinkButton: React.FC<{
  children: React.ReactNode
  to: string
}> = ({ children, to }) => {
  return (
    <Link className={cn({ [css.button]: true })} type="submit" to={to}>
      {children}
    </Link>
  )
}
