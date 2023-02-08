import { zCreateIdeaInput } from '@ideanick/backend/src/router/ideas/createIdea/input'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { Textarea } from '../../../components/Textarea'
import { UploadToS3 } from '../../../components/UploadToS3'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const NewIdeaPage = withPageWrapper({
  title: 'New Idea',
  authorizedOnly: true,
})(() => {
  const createIdea = trpc.createIdea.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
      images: [],
      certificate: null,
    },
    validationSchema: zCreateIdeaInput,
    onSubmit: async (values) => {
      await createIdea.mutateAsync(values)
    },
    successMessage: 'Idea created!',
    showValidationAlert: true,
  })

  return (
    <Segment title="New Idea">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Name" name="name" formik={formik} />
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Description" name="description" maxWidth={500} formik={formik} />
          <Textarea label="Text" name="text" formik={formik} />
          <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />
          <UploadToS3 label="Certificate" name="certificate" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Create Idea</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
