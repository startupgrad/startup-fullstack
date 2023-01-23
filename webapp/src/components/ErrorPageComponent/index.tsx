import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Alert } from '../Alert'
import { Segment } from '../Segment'

export const ErrorPageComponent: React.FC<{ title?: string; message?: string; children?: React.ReactNode }> = ({
  title = 'Oops, error',
  message = 'Something went wrong',
  children,
}) => {
  return (
    <Segment title={title}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Alert color="red">{message}</Alert>
      {children}
    </Segment>
  )
}
