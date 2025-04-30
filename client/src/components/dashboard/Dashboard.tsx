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
    { title: "Customers", value: customers.length },
    { title: "Projects", value: projects.length },
    { title: "Employees", value: employees.length },
    {
      title: "Monthly Revenue",
      value: `${formatCurrency(
        mrr.find(
          (item) =>
            item.month ===
            new Date().toLocaleString("en-US", { month: "short" })
        )?.revenue || 0,
        "EUR",
        "es-ES"
      )}`,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-4 grid-rows-[auto,30vh,30vh,30vh]">
      <div className="col-span-4 grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card
            key={kpi.title}
            className="p-4 flex flex-col justify-between items-center"
          >
            <h3 className="text-lg font-bold">{kpi.title}</h3>
            <p className="text-2xl text-ds-grey-900">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 col-span-4 h-full">
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
      <Card className=" col-span-4 p-4 h-full">
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-bold mb-2 text-center">
            Active Projects
          </h3>
          <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeProjects}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="activeCount"
                  name="Active Projects"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Card 4: Pie Chart - Employees Distribution */}
      <Card className="col-span-4 p-4 h-full">
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
                  outerRadius="90%"
                >
                  {employeesByRole.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        employeesGraphColors[
                          index % employeesGraphColors.length
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
