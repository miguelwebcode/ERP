import * as yup from "yup";

// const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const registerFormValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password required"),
  // We give it a default value if it doesn't find it or its not defined
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .default(null)
    .required("Confirm password required"),
});

export const loginFormValidationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const customerFormValidationSchema = yup.object({
  address: yup.string().required("Address is required").default(""),
  company: yup.string().required("Company is required").default(""),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .default(""),
  name: yup.string().required("Name is required").default(""),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^\d{9}$/, "Phone must contain 9 digits")
    .default(""),
});

export const projectFormValidationSchema = yup.object({
  name: yup.string().required("Name is required").default(""),
  state: yup.string().required("Project's state is required").default(""),
  description: yup.string().required("Description is required").default(""),
  startDate: yup.date().required("Start date is required"),
  customerId: yup.string().required("Customer ID is required").default(""),
  endDate: yup.date().required("End date is required"),
  employeeId: yup.string().required("Employee ID is required").default(""),
});

export const employeeFormValidationSchema = yup.object({
  name: yup.string().required("Name is required").default(""),
  role: yup.string().required("Role is required").default(""),
  email: yup.string().required("Email is required").default(""),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required").default(""),
  salary: yup.string().required("Salary is required"),
});

export const selectCustomerFormValidationSchema = yup.object({
  customerId: yup.string().required("Customer ID is required").default(""),
});

export const selectProjectFormValidationSchema = yup.object({
  projectId: yup.string().required("Project ID is required").default(""),
});

export const selectEmployeeFormValidationSchema = yup.object({
  employeeId: yup.string().required("Employee ID is required").default(""),
});
