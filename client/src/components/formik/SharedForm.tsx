// src/components/formik/SharedForm.tsx

import { ReactNode, Ref } from "react";
import { Formik, Form, FormikProps } from "formik";
import { FormikHelpers, FormikValues } from "formik";
import * as yup from "yup";

// Definimos un tipo genérico para las props del formulario compartido
type SharedFormProps<T> = {
  initialValues: T;
  validationSchema: yup.Schema<T>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
  children: ReactNode;
  innerRef?: Ref<FormikProps<T>>;
};

const SharedForm = <T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  innerRef,
}: SharedFormProps<T>) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
    innerRef={innerRef}
  >
    {() => <Form className="flex justify-center">{children}</Form>}
  </Formik>
);

export default SharedForm;
