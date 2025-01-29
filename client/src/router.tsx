import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { HomeView } from "./views/HomeView";
import { CustomersView } from "./views/customers/CustomersView";
import { ProjectsView } from "./views/projects/ProjectsView";
import { AddCustomerView } from "./views/customers/AddCustomerView";
import { EditCustomerView } from "./views/customers/EditCustomerView";
import { AddProjectView } from "./views/projects/AddProjectView";
import { EditProjectView } from "./views/projects/EditProjectView";
import { ReadCustomersView } from "./views/customers/ReadCustomersView";
import { DeleteCustomerView } from "./views/customers/DeleteCustomerView";
import { ReadProjectsView } from "./views/ReadProjectsView";
import { DeleteProjectView } from "./views/projects/DeleteProjectView";

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
