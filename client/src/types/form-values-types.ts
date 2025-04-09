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
};

export type ProjectFormValues = {
  name: string;
  state: string;
  description: string;
  startDate: Date | string;
  customer: string;
  endDate: Date | string;
  employee: string;
};

export type SelectCustomerFormValues = {
  customerId: string;
};

export type SelectProjectFormValues = {
  projectId: string;
};
