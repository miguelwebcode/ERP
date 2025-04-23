import Cookies from "js-cookie";

import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useEffect, useMemo, useState } from "react";

export default function Layout() {
  const { pathname } = useLocation();
  const hideSidebar = useMemo(() => {
    const paths = ["/login", "/register"];

    return paths.includes(pathname);
  }, [pathname]);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const cookieValue = Cookies.get("sidebar_state");
    return cookieValue === "true";
  });

  useEffect(() => {
    Cookies.set("sidebar_state", String(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  return (
    <>
      <SidebarProvider open={sidebarOpen} onOpenChange={toggleSidebar}>
        <div className={`${hideSidebar && "hidden"}`}>
          <AppSidebar />
          <SidebarTrigger className="block md:hidden" />
        </div>

        <main className="w-full mx-auto md:mx-4 pt-8">
          <Outlet />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </SidebarProvider>
    </>
  );
}
