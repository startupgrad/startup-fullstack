import { FormikHelpers, useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { AlertProps } from '../components/Alert'
import { ButtonProps } from '../components/Button'

type ValuesType<TMaybeZodSchema> = TMaybeZodSchema extends z.ZodTypeAny ? z.infer<TMaybeZodSchema> : {}

export const useForm = <TMaybeZodSchema extends z.ZodTypeAny | undefined = undefined>({
  successMessage = false,
  resetOnSuccess = true,
  showValidationAlert = false,
  initialValues,
  validationSchema,
  onSubmit,
}: {
  successMessage?: string | false
  resetOnSuccess?: boolean
  showValidationAlert?: boolean
  initialValues?: ValuesType<TMaybeZodSchema>
  validationSchema?: TMaybeZodSchema
  onSubmit?: (
    values: ValuesType<TMaybeZodSchema>,
    actions: FormikHelpers<ValuesType<TMaybeZodSchema>>
  ) => Promise<any> | any
}) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<Error | null>(null)

  const formik = useFormik<ValuesType<TMaybeZodSchema>>({
    initialValues: initialValues || ({} as any),
    ...(validationSchema && { validationSchema: toFormikValidationSchema(validationSchema) }),
    onSubmit: async (values, formikHelpers) => {
      if (!onSubmit) {
        return
      }
      try {
        setSubmittingError(null)
        await onSubmit(values, formikHelpers)
        if (resetOnSuccess) {
          formik.resetForm()
        }
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
      } catch (error: any) {
        setSubmittingError(error)
      }
    },
  })

  const alertProps = useMemo<AlertProps>(() => {
    if (submittingError) {
      return {
        hidden: false,
        children: submittingError.message,
        color: 'red',
      }
    }
    if (showValidationAlert && !formik.isValid && !!formik.submitCount) {
      return {
        hidden: false,
        children: 'Some fields are invalid',
        color: 'red',
      }
    }
    if (successMessageVisible && successMessage) {
      return {
        hidden: false,
        children: successMessage,
        color: 'green',
      }
    }
    return {
      color: 'red',
      hidden: true,
      children: null,
    }
  }, [submittingError, formik.isValid, formik.submitCount, successMessageVisible, successMessage, showValidationAlert])

  const buttonProps = useMemo<Omit<ButtonProps, 'children'>>(() => {
    return {
      loading: formik.isSubmitting,
    }
  }, [formik.isSubmitting])

  return {
    formik,
    alertProps,
    buttonProps,
  }
}
