import { useEffect, useState } from "react";
import { fetchAllCustomers } from "../../../services/customers/service/customersService";
import { Customer } from "../../../types";
import { CustomerCard } from "../../../components/customers/CustomerCard/CustomerCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";

export const ReadCustomersView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    fetchAllCustomers(setCustomers);
  }, []);
  return (
    <>
      <h1 className="uppercase font-bold text-3xl text-center mb-10">
        All Customers
      </h1>

      <div className="flex justify-center flex-wrap gap-6">
        {customers.map((customer, i) => {
          return (
            <SharedCard key={i}>
              <CustomerCard customer={customer} />
            </SharedCard>
          );
        })}
      </div>
    </>
  );
};
