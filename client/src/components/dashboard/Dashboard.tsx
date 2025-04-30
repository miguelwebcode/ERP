import { emplloyeesGraphColors } from "@/data";
import { fetchCustomerIds } from "@/services/customers/service/customersService";
import {
  fetchEmployeeIds,
  countEmployeesByRole,
} from "@/services/employees/service/employeesService";
import { fetchProjectIds } from "@/services/projects/service/projectsService";
import { fetchHistoricalMrr } from "@/services/subscriptions/service/subscriptionsService";
import { MrrMonth } from "@/types";
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

const newClientsProjects = [
  { month: "Jan", clients: 30, projects: 10 },
  { month: "Feb", clients: 50, projects: 20 },
  { month: "Mar", clients: 70, projects: 30 },
  { month: "Apr", clients: 65, projects: 28 },
  { month: "May", clients: 80, projects: 40 },
  { month: "Jun", clients: 75, projects: 35 },
  { month: "Jul", clients: 95, projects: 48 },
  { month: "Aug", clients: 85, projects: 42 },
  { month: "Sep", clients: 90, projects: 45 },
  { month: "Oct", clients: 105, projects: 55 },
  { month: "Nov", clients: 100, projects: 50 },
  { month: "Dec", clients: 120, projects: 62 },
];

export const Dashboard = () => {
  const [employees, setEmployees] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [employeesByRole, setEmployeesByRole] = useState<
    { name: string; value: number }[]
  >([]);
  const [mrr, setMrr] = useState<MrrMonth[]>([]);

  const getMonthRevenues = async () => {
    const mrr = await fetchHistoricalMrr();
    setMrr(mrr);
    console.log(mrr);
  };

  useEffect(() => {
    fetchEmployeeIds(setEmployees);
    fetchCustomerIds(setCustomers);
    fetchProjectIds(setProjects);
    getMonthRevenues();

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
    { title: "Total Clients", value: customers.length },
    { title: "Active Projects", value: projects.length },
    { title: "Total Employees", value: employees.length },
    {
      title: "Monthly Revenue (MRR)",
      value: `${
        mrr.find(
          (item) =>
            item.month ===
            new Date().toLocaleString("en-US", { month: "short" })
        )?.revenue || 0
      }€`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 grid-rows-[auto,30vh,30vh]">
      <div className="col-span-2 grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="p-4 text-center">
            <h3 className="text-lg font-bold">{kpi.title}</h3>
            <p className="text-2xl text-ds-grey-900">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 col-span-2 h-full">
        <div className="flex flex-col w-full h-full">
          <h3 className="text-xl font-bold mb-2 text-center">
            Revenue/MRR Trend
          </h3>
          <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrr}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Card 3: Bar Chart - Monthly Comparison */}
      <Card className="p-4 h-full">
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-bold mb-2 text-center">
            New Clients & Projects
          </h3>
          <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newClientsProjects}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clients" fill="#8884d8" />
                <Bar dataKey="projects" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Card 4: Pie Chart - Employees Distribution */}
      <Card className="p-4 h-full">
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-bold mb-2 text-center">
            Employees by Department
          </h3>
          <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeesByRole}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                >
                  {employeesByRole.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        emplloyeesGraphColors[
                          index % emplloyeesGraphColors.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
