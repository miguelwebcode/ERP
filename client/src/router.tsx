import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { HomeView } from "./views/HomeView";
import { CustomersView } from "./views/CustomersView";
import { ProjectsView } from "./views/ProjectsView";
import { AddCustomerView } from "./views/AddCustomerView";
import { EditCustomerView } from "./views/EditCustomerView";
import { AddProjectView } from "./views/AddProjectView";
import { EditProjectView } from "./views/EditProjectView";

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
          <Route path="/customers/edit" element={<EditCustomerView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/add" element={<AddProjectView />} />
          <Route path="/projects/edit" element={<EditProjectView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
