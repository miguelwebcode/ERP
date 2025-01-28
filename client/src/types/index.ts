export type Role = {
  id: string;
  value: "Developer" | "Salesman" | "Manager";
};

export type ProjectState = {
  id: string;
  value: "Pending" | "In Progress" | "Completed" | "On Hold" | "Cancelled";
};

export type Customer = {
  address: string;
  company: string;
  createdAt: string;
  customerId: string;
  email: string;
  name: string;
  phone: string;
  project: string;
  updatedAt?: string;
};
