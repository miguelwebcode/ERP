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
  name: string;
  description: string;
  customerId: string;
  startDate: string;
  endDate: string;
  state: string;
  developer: string;
  createdAt: string;
  updatedAt?: string;
};
