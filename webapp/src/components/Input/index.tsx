import { FormikProps } from 'formik'

export const Input: React.FC<{
  label: string
  name: string
  formik: FormikProps<any>
}> = ({ label, name, formik }) => {
  const value = formik.values[name]

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        type="text"
        onChange={(e) => formik.setFieldValue(name, e.target.value)}
        value={value}
        name={name}
        id={name}
      />
    </div>
  )
}
