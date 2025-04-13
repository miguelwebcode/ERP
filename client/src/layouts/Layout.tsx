import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header/Header";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container mx-auto pt-ds-32">
        <Outlet />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
