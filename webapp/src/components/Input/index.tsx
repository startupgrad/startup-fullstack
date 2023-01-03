import { FormikProps } from 'formik'

export const Input: React.FC<{
  label: string
  name: string
  formik: FormikProps<any>
}> = ({ label, name, formik }) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        disabled={formik.isSubmitting}
        type="text"
        onChange={(e) => formik.setFieldValue(name, e.target.value)}
        onBlur={() => formik.setFieldTouched(name)}
        value={value}
        name={name}
        id={name}
      />
      {touched && error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
