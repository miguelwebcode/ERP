export interface Customer {
  customerId?: string;
  name: string;
  email: string;
  address: string;
  company: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  projectId?: string;
  customerId: string;
  employeeId: string;
  description: string;
  developer: string;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}
