import { formatCurrency } from "@/lib/utils";
import { fetchCustomerIds } from "@/services/customers/service/customersService";
import {
  fetchEmployeeIds,
  countEmployeesByRole,
  fetchAllEmployees,
} from "@/services/employees/service/employeesService";
import {
  fetchActiveProjectsHistory,
  fetchProjectIds,
  fetchAllProjects,
} from "@/services/projects/service/projectsService";
import { fetchHistoricalMrr } from "@/services/subscriptions/service/subscriptionsService";
import { ActiveProjectsMonth, MrrMonth, Employee, Project } from "@/types";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import { MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/stores/app-store";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const EmployeeActions = ({ employee }: { employee: Employee }) => {
  const setSelectedEmployeeId = useAppStore(
    (state) => state.setSelectedEmployeeId
  );
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(employee.id)}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy employee ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedEmployeeId(employee.id);
            navigate("/employees/edit");
          }}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit employee
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedEmployeeId(employee.id);
            navigate("/employees/delete");
          }}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete employee
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ProjectActions = ({ project }: { project: Project }) => {
  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(project.id)}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy project ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedProjectId(project.id);
            navigate("/projects/edit");
          }}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit project
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedProjectId(project.id);
            navigate("/projects/delete");
          }}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Dashboard = () => {
  const [employees, setEmployees] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [employeesByRole, setEmployeesByRole] = useState<
    { name: string; value: number }[]
  >([]);
  const [mrr, setMrr] = useState<MrrMonth[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProjectsMonth[]>(
    []
  );
  const [hoveredRole, setHoveredRole] = useState<{
    name: string;
    value: number;
  } | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8;
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projectsCurrentPage, setProjectsCurrentPage] = useState(1);
  const projectsPerPage = 8;

  // Blue color palette for pie chart
  const blueColors = [
    "#1e40af", // blue-800
    "#3b82f6", // blue-500
    "#60a5fa", // blue-400
    "#93c5fd", // blue-300
    "#dbeafe", // blue-200
  ];

  useEffect(() => {
    fetchEmployeeIds(setEmployees);
    fetchCustomerIds(setCustomers);
    fetchProjectIds(setProjects);
    fetchHistoricalMrr(setMrr);
    fetchActiveProjectsHistory(setActiveProjects);
    fetchAllEmployees(setAllEmployees);

    fetchAllProjects(setAllProjects);

    // Actualiza employeesByRole
    countEmployeesByRole((roleCounts) => {
      const formattedRoles = Object.entries(roleCounts).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      setEmployeesByRole(formattedRoles);
    });
  }, []);

  const kpiData = [
    {
      title: "Monthly Revenue",
      value: `${formatCurrency(
        mrr.find(
          (item) =>
            item.month.slice(0, 3) ===
            new Date().toLocaleString("en-US", { month: "short" })
        )?.revenue || 0,
        "EUR",
        "es-ES"
      )}`,
    },
    {
      title: "Monthly Expenses",
      value: `${formatCurrency(
        allEmployees.reduce(
          (total, employee) => total + Number(employee.salary),
          0
        ) / 12,
        "EUR",
        "es-ES"
      )}`,
    },
    { title: "Customers", value: customers.length },
    { title: "Projects", value: projects.length },
    { title: "Employees", value: employees.length },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                {kpi.title}
              </h3>
              <p
                className={`text-2xl font-bold ${
                  kpi.title === "Monthly Expenses"
                    ? "text-red-600"
                    : kpi.title === "Monthly Revenue"
                    ? "text-green-600"
                    : "text-gray-900"
                }`}
              >
                {kpi.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue/MRR Trend Chart - Full Width */}
      <Card className="bg-white rounded-lg p-6 shadow-lg mb-8">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue/MRR Trend
            </h3>
            <div className="flex space-x-2 text-xs"></div>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mrr}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14 }}
                />
                <Tooltip />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Third Row: Employees by Department (1/4) + Human Resources Table (3/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Employees by Department Pie Chart - 1/4 width */}
        <Card className="bg-white rounded-lg p-4 shadow-lg lg:col-span-1">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Employees by Department
            </h3>
            <div className="flex-grow flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={employeesByRole}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                      >
                        {employeesByRole.map((role, index) => (
                          <Cell
                            key={index}
                            fill={blueColors[index % blueColors.length]}
                            onMouseEnter={() => setHoveredRole(role)}
                            onMouseLeave={() => setHoveredRole(null)}
                            style={{ cursor: "pointer" }}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-xl font-bold">{employees.length}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                </div>

                {/* External Tooltip */}
                <div className="h-12 flex items-center justify-center">
                  {hoveredRole ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
                      <p className="text-xs font-medium text-gray-900">
                        {hoveredRole.name}
                      </p>
                      <p className="text-sm font-bold text-blue-500">
                        {hoveredRole.value} employee
                        {hoveredRole.value === 1 ? "" : "s"}
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 text-center">
                      Hover over segments
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              {employeesByRole.map((role, index) => (
                <div
                  key={role.name}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        backgroundColor: blueColors[index % blueColors.length],
                      }}
                    ></div>
                    <span className="text-sm font-medium">{role.name}</span>
                  </div>
                  <div className="text-md font-medium">
                    {Math.round((role.value / employees.length) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Human Resources Table - 3/4 width */}
        <Card className="bg-white rounded-lg p-4 shadow-lg lg:col-span-3">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Employees
            </h3>
            <div className="flex-grow overflow-auto">
              {allEmployees.length > 0 ? (
                <div className="rounded-lg overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="text-left py-3 px-4 font-medium">
                          Actions
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Full Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Position
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Phone
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEmployees
                        .slice(
                          (currentPage - 1) * employeesPerPage,
                          currentPage * employeesPerPage
                        )
                        .map((employee, index) => (
                          <tr
                            key={employee.id || index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-blue-50"
                            }
                          >
                            <td className="py-3 px-4">
                              <EmployeeActions employee={employee} />
                            </td>
                            <td className="py-3 px-4 text-gray-900 font-medium">
                              {employee.name}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {employee.role}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {employee.phone}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {employee.email}
                            </td>
                            <td className="py-3 px-4 text-blue-600 font-medium">
                              {employee.salary} €
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {allEmployees.length > 0 && (
                    <div className="border-t border-gray-200">
                      <div className="flex items-center justify-between py-3 px-4 text-sm text-gray-500">
                        <div>
                          Showing {(currentPage - 1) * employeesPerPage + 1}-
                          {Math.min(
                            currentPage * employeesPerPage,
                            allEmployees.length
                          )}{" "}
                          of {allEmployees.length} employees
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="flex items-center text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Previous
                          </button>
                          <span className="text-gray-600">
                            Page {currentPage} of{" "}
                            {Math.ceil(allEmployees.length / employeesPerPage)}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(
                                    allEmployees.length / employeesPerPage
                                  )
                                )
                              )
                            }
                            disabled={
                              currentPage ===
                              Math.ceil(allEmployees.length / employeesPerPage)
                            }
                            className="flex items-center text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Next
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No employees found
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Fourth Row: Projects Table (2/4) + Active Projects Chart (2/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
        {/* Projects Table - 2/4 width */}
        <Card className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projects
            </h3>
            <div className="flex-grow overflow-auto">
              {allProjects.length > 0 ? (
                <div className="rounded-lg overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="text-left py-3 px-4 font-medium">
                          Actions
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Project Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          State
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Start Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          End Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProjects
                        .slice(
                          (projectsCurrentPage - 1) * projectsPerPage,
                          projectsCurrentPage * projectsPerPage
                        )
                        .map((project, index) => (
                          <tr
                            key={project.id || index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-blue-50"
                            }
                          >
                            <td className="py-3 px-4">
                              <ProjectActions project={project} />
                            </td>
                            <td className="py-3 px-4 text-gray-900 font-medium">
                              {project.name}
                            </td>
                            <td className="py-3 px-4 text-blue-600 font-medium">
                              {project.state}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {project.startDate}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {project.endDate}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {allProjects.length > 0 && (
                    <div className="border-t border-gray-200">
                      <div className="flex items-center justify-between py-3 px-4 text-sm text-gray-500">
                        <div>
                          Showing{" "}
                          {(projectsCurrentPage - 1) * projectsPerPage + 1}-
                          {Math.min(
                            projectsCurrentPage * projectsPerPage,
                            allProjects.length
                          )}{" "}
                          of {allProjects.length} projects
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              setProjectsCurrentPage((prev) =>
                                Math.max(prev - 1, 1)
                              )
                            }
                            disabled={projectsCurrentPage === 1}
                            className="flex items-center text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Previous
                          </button>
                          <span className="text-gray-600">
                            Page {projectsCurrentPage} of{" "}
                            {Math.ceil(allProjects.length / projectsPerPage)}
                          </span>
                          <button
                            onClick={() =>
                              setProjectsCurrentPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(
                                    allProjects.length / projectsPerPage
                                  )
                                )
                              )
                            }
                            disabled={
                              projectsCurrentPage ===
                              Math.ceil(allProjects.length / projectsPerPage)
                            }
                            className="flex items-center text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Next
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No projects found
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Active Projects Chart - 2/4 width */}
        <Card className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Active Projects
            </h3>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activeProjects}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="activeCount"
                    name="Active Projects"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
