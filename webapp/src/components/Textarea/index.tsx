import { FormikProps } from 'formik'

export const Textarea: React.FC<{
  label: string
  name: string
  formik: FormikProps<any>
}> = ({ label, name, formik }) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />
      <textarea onChange={(e) => formik.setFieldValue(name, e.target.value)} value={value} name={name} id={name} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
