import Cookies from 'js-cookie'

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useEffect, useState } from 'react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const cookieValue = Cookies.get("sidebar_state");
    return cookieValue === "true";
  });

  useEffect(() => {
    Cookies.set("sidebar_state", String(sidebarOpen)); // Guarda el estado actual en la cookie
  }, [sidebarOpen]);

  const toggleSidebar = (isOpen:boolean) => {
    setSidebarOpen(isOpen);
  };

  

  return (
    <>
      <SidebarProvider open={sidebarOpen} onOpenChange={toggleSidebar}>
        {/* <Header /> */}
        <AppSidebar/>
        <SidebarTrigger className='block md:hidden'/>

        <main className="container mx-auto pt-8">
          <Outlet />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </SidebarProvider>
    </>
  );
}
