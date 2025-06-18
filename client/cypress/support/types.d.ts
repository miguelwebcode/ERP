export interface Customer {
  id?: string;
  name: string;
  email: string;
  address: string;
  company: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Employee {
  id?: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
  salary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id?: string;
  customerId: string;
  employeeId: string;
  description: string;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}
