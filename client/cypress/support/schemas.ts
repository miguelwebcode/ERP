import * as yup from "yup";

export const customerSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  company: yup.string().required(),
  phone: yup.string().required(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});

export const employeeSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  role: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  address: yup.string().required(),
  salary: yup.string().required(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});

export const projectSchema = yup.object({
  id: yup.string().required(),
  customerId: yup.string().required(),
  employeeId: yup.string().required(),
  description: yup.string().required(),
  name: yup.string().required(),
  state: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});
