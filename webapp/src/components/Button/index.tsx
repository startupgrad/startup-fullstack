import cn from 'classnames'
import React from 'react'
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
