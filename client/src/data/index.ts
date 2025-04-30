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

export const employeesGraphColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
];
