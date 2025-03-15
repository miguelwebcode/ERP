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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/customers" element={<CustomersView />} />
          <Route path="/customers/add" element={<AddCustomerView />} />
          <Route path="/customers/read" element={<ReadCustomersView />} />
          <Route path="/customers/edit" element={<EditCustomerView />} />
          <Route path="/customers/delete" element={<DeleteCustomerView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/add" element={<AddProjectView />} />
          <Route path="/projects/read" element={<ReadProjectsView />} />
          <Route path="/projects/edit" element={<EditProjectView />} />
          <Route path="/projects/delete" element={<DeleteProjectView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
