import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header/Header";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  return (
    <>
      <SidebarProvider open={sidebarOpen} onOpenChange={toggleSidebar}>
        {/* <Header /> */}
        <AppSidebar/>
        <SidebarTrigger/>

      <main className="container mx-auto pt-8">
        <Outlet />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
      </SidebarProvider>
    </>
  );
}
