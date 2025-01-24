import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header";

export default function Layout() {
  return (
    <>
      <Header />
      {/* Inyecta las rutas que estén agrupadas en este layout */}
      <main className="container mx-auto py-16">
        <Outlet />
      </main>
    </>
  );
}
