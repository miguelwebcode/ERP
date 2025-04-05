import Card from "@mui/material/Card";

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

const kpiData = [
  { title: "Total Clients", value: 1200 },
  { title: "Active Projects", value: 45 },
  { title: "Total Employees", value: 300 },
  { title: "Monthly Revenue (MRR)", value: "$150K" },
];

const revenueTrend = [
  { month: "Jan", revenue: 100 },
  { month: "Feb", revenue: 120 },
  { month: "Mar", revenue: 150 },
  { month: "Apr", revenue: 140 },
  { month: "May", revenue: 180 },
  { month: "Jun", revenue: 210 },
  { month: "Jul", revenue: 260 },
  { month: "Aug", revenue: 280 },
  { month: "Sep", revenue: 260 },
  { month: "Oct", revenue: 270 },
  { month: "Nov", revenue: 310 },
  { month: "Dec", revenue: 380 },
];

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
const employeesByDepartment = [
  { name: "Engineering", value: 120 },
  { name: "Sales", value: 80 },
  { name: "HR", value: 50 },
  { name: "Marketing", value: 30 },
  { name: "Support", value: 20 },
];

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 grid-rows-[auto,30vh,30vh]">
      <div className="col-span-2 grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="p-4 text-center">
            <h3 className="text-lg font-bold">{kpi.title}</h3>
            <p className="text-2xl">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 col-span-2 h-full">
        <div className="flex flex-col w-full h-full">
          <h3 className="text-lg font-bold mb-2 text-center">
            Revenue/MRR Trend
          </h3>
          <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
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
          <h3 className="text-lg font-bold mb-2 text-center">
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
          <h3 className="text-lg font-bold mb-2 text-center">
            Employees by Department
          </h3>
          <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeesByDepartment}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                >
                  {employeesByDepartment.map((entry, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                  <Cell fill="bg-" />
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
}
