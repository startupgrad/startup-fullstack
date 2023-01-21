import cn from 'classnames'
import { FormikProps } from 'formik'
import css from './styles.module.scss'

export const Input: React.FC<{
  label: string
  name: string
  formik: FormikProps<any>
  maxWidth?: number | string
  type?: 'text' | 'password'
}> = ({ label, name, formik, maxWidth, type = 'text' }) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean
  const invalid = touched && !!error
  const disabled = formik.isSubmitting

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={cn({ [css.input]: true, [css.invalid]: invalid })}
        style={{ maxWidth }}
        disabled={disabled}
        type={type}
        onChange={(e) => formik.setFieldValue(name, e.target.value)}
        onBlur={() => formik.setFieldTouched(name)}
        value={value}
        name={name}
        id={name}
      />
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
