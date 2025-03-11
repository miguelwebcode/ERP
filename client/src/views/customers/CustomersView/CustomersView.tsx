import { CustomersNavigationCard } from "../../../components/customers/CustomersNavigationCard/CustomersNavigationCard";

export const CustomersView = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="uppercase font-bold text-3xl">CUSTOMERS</h1>
      <CustomersNavigationCard />
    </div>
  );
};
