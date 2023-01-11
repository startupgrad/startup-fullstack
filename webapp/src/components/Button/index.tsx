import cn from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import css from './styles.module.scss'

export const Button: React.FC<{
  children: React.ReactNode
  loading?: boolean
}> = ({ children, loading = false }) => {
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
