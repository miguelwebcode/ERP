export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  name: string;
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type CustomerFormValues = {
  address: string;
  company: string;
  email: string;
  name: string;
  phone: string;
  project: string;
};

export type ProjectFormValues = {
  customerId: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  name: string;
  state: string;
  developer: string;
};

export type SelectCustomerFormValues = {
  customerId: string;
};

export type SelectProjectFormValues = {
  projectId: string;
};
