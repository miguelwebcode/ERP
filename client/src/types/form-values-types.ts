export type CustomerFormValues = {
  address: string;
  company: string;
  email: string;
  name: string;
  phone: string;
  project: string;
};

export type EditCustomerFormValues = {
  customerId: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type ProjectFormValues = {
  customerId: string;
  description: string;
  startDate: Date | "";
  endDate: Date | "";
  name: string;
  state: string;
  developer: string;
};

export type RegisterFormValues = {
  name: string;
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
};
