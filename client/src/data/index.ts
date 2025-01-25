import { ProjectState, Role } from "../types";

export const roles: Role[] = [
  { id: "developer", value: "Developer" },
  { id: "salesman", value: "Salesman" },
  { id: "manager", value: "Manager" },
];

export const projectStates: ProjectState[] = [
  { id: "pending", value: "Pending" },
  { id: "inProgress", value: "In Progress" },
  { id: "completed", value: "Completed" },
  { id: "onHold", value: "On Hold" },
  { id: "cancelled", value: "Cancelled" },
];
