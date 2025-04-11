import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import { LoginView } from "../views/LoginView/LoginView";
import { RegisterView } from "../views/RegisterView/RegisterView";
import { HomeView } from "../views/HomeView/HomeView";
import { CustomersView } from "../views/customers/CustomersView/CustomersView";
import { ProjectsView } from "../views/projects/ProjectsView/ProjectsView";
import { AddCustomerView } from "../views/customers/AddCustomerView/AddCustomerView";
import { EditCustomerView } from "../views/customers/EditCustomerView/EditCustomerView";
import { AddProjectView } from "../views/projects/AddProjectView/AddProjectView";
import { EditProjectView } from "../views/projects/EditProjectView/EditProjectView";
import { ReadCustomersView } from "../views/customers/ReadCustomersView/ReadCustomersView";
import { DeleteCustomerView } from "../views/customers/DeleteCustomerView/DeleteCustomerView";
import { ReadProjectsView } from "../views/projects/ReadProjectsView/ReadProjectsView";
import { DeleteProjectView } from "../views/projects/DeleteProjectView/DeleteProjectView";
import ProtectedRoute from "./ProtectedRoute";
import { UnauthenticatedRoute } from "./UnauthenticatedRoute";
import CustomersLayout from "../layouts/CustomersLayout";
import ProjectsLayout from "../layouts/ProjectsLayout";
import EmployeesLayout from "../layouts/EmployeesLayout";
import { AddEmployeeView } from "../views/employees/AddEmployeeView/AddEmployeeView";
import { DeleteEmployeeView } from "../views/employees/DeleteEmployeeView/DeleteEmployeeView";
import EditEmployeeView from "../views/employees/EditEmployeeView/EditEmployeeView";
import { EmployeesView } from "../views/employees/EmployeesView/EmployeesView";
import { ReadEmployeesView } from "../views/employees/ReadEmployeesView/ReadEmployeesView";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<UnauthenticatedRoute />}>
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route index element={<HomeView />} />
            <Route element={<CustomersLayout />}>
              <Route path="/customers" element={<CustomersView />} />
              <Route path="/customers/add" element={<AddCustomerView />} />
              <Route path="/customers/read" element={<ReadCustomersView />} />
              <Route path="/customers/edit" element={<EditCustomerView />} />
              <Route
                path="/customers/delete"
                element={<DeleteCustomerView />}
              />
            </Route>
            <Route element={<ProjectsLayout />}>
              <Route path="/projects" element={<ProjectsView />} />
              <Route path="/projects/add" element={<AddProjectView />} />
              <Route path="/projects/read" element={<ReadProjectsView />} />
              <Route path="/projects/edit" element={<EditProjectView />} />
              <Route path="/projects/delete" element={<DeleteProjectView />} />
            </Route>
            <Route element={<EmployeesLayout />}>
              <Route path="/employees" element={<EmployeesView />} />
              <Route path="/employees/add" element={<AddEmployeeView />} />
              <Route path="/employees/read" element={<ReadEmployeesView />} />
              <Route path="/employees/edit" element={<EditEmployeeView />} />
              <Route
                path="/employees/delete"
                element={<DeleteEmployeeView />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
