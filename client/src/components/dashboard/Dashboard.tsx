import { employeesGraphColors } from "@/data";
import { formatCurrency } from "@/lib/utils";
import { fetchCustomerIds } from "@/services/customers/service/customersService";
import {
  fetchEmployeeIds,
  countEmployeesByRole,
} from "@/services/employees/service/employeesService";
import {
  fetchActiveProjectsHistory,
  fetchProjectIds,
} from "@/services/projects/service/projectsService";
import { fetchHistoricalMrr } from "@/services/subscriptions/service/subscriptionsService";
import { ActiveProjectsMonth, MrrMonth } from "@/types";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
    { title: "Customers", value: customers.length },
    { title: "Projects", value: projects.length },
    { title: "Employees", value: employees.length },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header
      <div className="mb-8">
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <h1 className="text-white text-2xl font-bold">ERP Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/20 text-white placeholder-white/70 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5-5-5h5v-5h5v5z"
                />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <span className="text-white text-sm">Welcome, User!</span>
            </div>
          </div>
        </div>

        <h2 className="text-white text-xl font-semibold mb-4">Sales</h2>
      </div> */}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <Card key={kpi.title} className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-col">
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                {kpi.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
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
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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

      {/* Second Row: Active Projects and Employees by Department */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Bar Chart */}
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
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
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

        {/* Employees by Department Pie Chart */}
        <Card className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Employees by Department
          </h3>
          <div className="flex-grow flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={employeesByRole}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                  >
                    {employeesByRole.map((_, index) => (
                      <Cell
                        key={index}
                        fill={blueColors[index % blueColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{employees.length}</p>
                  <p className="text-sm text-gray-500">Total Number</p>
                  <p className="text-sm text-gray-500">Of Employees</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {employeesByRole.map((role, index) => (
              <div
                key={role.name}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: blueColors[index % blueColors.length],
                    }}
                  ></div>
                  <span className="text-sm">{role.name}</span>
                </div>
                <div className="text-sm font-medium">
                  {Math.round((role.value / employees.length) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Dashboard;
