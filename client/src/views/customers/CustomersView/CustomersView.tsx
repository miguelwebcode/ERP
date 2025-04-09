import { CustomersNavigationCard } from "../../../components/customers/CustomersNavigationCard/CustomersNavigationCard";

export const CustomersView = () => {
  return (
    <div className="flex items-center h-[70vh]">
      <CustomersNavigationCard />
      <div className="flex flex-1  items-center justify-center">
        <p className="font-bold text-ds-lg text-ds-grey-600 text-center">
          Select an option to{" "}
          <span className="text-ds-primary-500">manage customers</span>
        </p>
      </div>
    </div>
  );
};
