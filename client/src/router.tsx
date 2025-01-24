import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { HomeView } from "./views/HomeView";
import { CustomersView } from "./views/CustomersView";
import { ProjectsView } from "./views/ProjectsView";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/customers" element={<CustomersView />} />
          <Route path="/projects" element={<ProjectsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
