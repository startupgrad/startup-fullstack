import css from './styles.module.scss'
import cn from 'classnames'
import { FormikProps } from 'formik'

export const Textarea: React.FC<{
  label: string
  name: string
  formik: FormikProps<any>
}> = ({ label, name, formik }) => {
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
      <textarea
        className={cn({ [css.input]: true, [css.invalid]: invalid })}
        disabled={formik.isSubmitting}
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
