// src/components/formik/SharedForm.tsx

import { ReactNode } from "react";
import { Formik, Form } from "formik";
import { FormikHelpers, FormikValues } from "formik";
import * as yup from "yup";

// Definimos un tipo genérico para las props del formulario compartido
type SharedFormProps<T> = {
  initialValues: T;
  validationSchema: yup.Schema<T>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
  children: ReactNode;
};

const SharedForm = <T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: SharedFormProps<T>) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {() => <Form className="flex justify-center">{children}</Form>}
  </Formik>
);

export default SharedForm;
