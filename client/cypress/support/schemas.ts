// filepath: cypress/support/yup-schemas.ts
import * as yup from "yup";

export const customerSchema = yup.object({
  customerId: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  company: yup.string().required(),
  phone: yup.string().required(),
  project: yup.string().required(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});
