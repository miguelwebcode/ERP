export type Role = {
  id: string;
  value: "Developer" | "Salesman" | "Manager";
};

export type ProjectState = {
  id: string;
  value: "Pending" | "In Progress" | "Completed" | "On Hold" | "Cancelled";
};

export type Customer = {
  id: string;
  name: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
};

export type Project = {
  id: string;
  name: string;
  state: string;
  description: string;
  startDate: string;
  customer: string;
  endDate: string;
  employee: string;
  createdAt: string;
  updatedAt?: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  salary: string;
};
