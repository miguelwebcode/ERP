import { Outlet } from "react-router-dom";
import { CustomersNavigationCard } from "../components/customers/CustomersNavigationCard/CustomersNavigationCard";

export default function CustomersLayout() {
  return (
    <div className="flex items-start h-[80vh] pt-4">
      <CustomersNavigationCard />
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
