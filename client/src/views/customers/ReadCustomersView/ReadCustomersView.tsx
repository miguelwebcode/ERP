import { useEffect, useState } from "react";
import { fetchAllCustomers } from "../../../services/customers/service/customersService";
import { Customer } from "../../../types";
import { CustomerCard } from "../../../components/customers/CustomerCard/CustomerCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { NoCustomersFoundMessage } from "../../../components/customers/NoCustomersFoundMessage/NoCustomersFoundMessage";

export const ReadCustomersView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    fetchAllCustomers(setCustomers);
  }, []);
  return (
    <>
      {customers.length ? (
        <div className="flex justify-center flex-wrap gap-ds-24 h-[80vh] overflow-y-auto">
          {customers.map((customer, i) => {
            return (
              <SharedCard key={i}>
                <CustomerCard customer={customer} />
              </SharedCard>
            );
          })}
        </div>
      ) : (
        <NoCustomersFoundMessage />
      )}
    </>
  );
};
