import * as yup from "yup";

export const customerSchema = yup.object({
  customerId: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  company: yup.string().required(),
  phone: yup.string().required(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});

export const projectSchema = yup.object({
  projectId: yup.string().required(),
  customerId: yup.string().required(),
  description: yup.string().required(),
  developer: yup.string().required(),
  name: yup.string().required(),
  state: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});
