import { zCreateIdeaInput } from '@ideanick/backend/src/router/createIdea/input'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { trpc } from '../../lib/trpc'

export const NewIdeaPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const createIdea = trpc.createIdea.useMutation()
  const formik = useFormik({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validationSchema: toFormikValidationSchema(zCreateIdeaInput),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        await createIdea.mutateAsync(values)
        formik.resetForm()
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
      } catch (err: any) {
        setSubmittingError(err.message)
      }
    },
  })

  return (
    <Segment title="New Idea">
      <form onSubmit={formik.handleSubmit}>
        <Input label="Name" name="name" formik={formik} />
        <Input label="Nick" name="nick" formik={formik} />
        <Input label="Description" maxWidth={500} name="description" formik={formik} />
        <Textarea label="Text" name="text" formik={formik} />
        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Some fields are invalid</div>}
        {submittingError && <div style={{ color: 'red' }}>{submittingError}</div>}
        {successMessageVisible && <div style={{ color: 'green' }}>Idea created!</div>}
        <button disabled={formik.isSubmitting} type="submit">
          {formik.isSubmitting ? 'Submitting...' : 'Create Idea'}
        </button>
      </form>
    </Segment>
  )
}
