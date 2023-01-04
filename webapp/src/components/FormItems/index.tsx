import css from './styles.module.scss'
import React from 'react'

export const FormItems: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={css.formItems}>{children}</div>
}
