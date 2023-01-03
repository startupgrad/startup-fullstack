import React from 'react'
import css from './styles.module.scss'

export const Segment: React.FC<{
  title: React.ReactNode
  size?: 1 | 2
  description?: string
  children?: React.ReactNode
}> = ({ title, size = 1, description, children }) => {
  return (
    <div className={css.segment}>
      {size === 1 ? <h1 className={css.title}>{title}</h1> : <h2 className={css.title}>{title}</h2>}
      {description && <p className={css.description}>{description}</p>}
      {children && <div className={css.content}>{children}</div>}
    </div>
  )
}
