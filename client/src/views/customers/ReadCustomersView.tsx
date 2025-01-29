import { useEffect, useState } from "react";
import { getAllCustomers } from "../../services/customers";
import { Customer } from "../../types";
import { CustomerCard } from "../../components/customers/CustomerCard";
import { SharedCard } from "../../components/ui/SharedCard";

export const ReadCustomersView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    const fetchAllCustomers = async () => {
      const result = await getAllCustomers();
      setCustomers(result as Customer[]);
    };
    fetchAllCustomers();
  }, []);
  return (
    <div className="flex justify-center flex-wrap gap-6">
      {customers.map((customer) => {
        return (
          <SharedCard>
            <CustomerCard customer={customer} />
          </SharedCard>
        );
      })}
    </div>
  );
};
