import React from 'react'
import css from './styles.module.scss'

export const FormItems: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={css.formItems}>{children}</div>
}
