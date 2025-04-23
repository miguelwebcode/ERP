import { useEffect, useState } from "react";
import { fetchAllCustomers } from "../../../services/customers/service/customersService";
import { Customer } from "../../../types";
import { NoCustomersFoundMessage } from "../../../components/customers/NoCustomersFoundMessage/NoCustomersFoundMessage";
import { DataTable } from "@/components/ui/data-table";
import { customerColumns } from "@/components/customers/CustomersTable/customerColumns";

export const ReadCustomersView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllCustomers((fetchedCustomers) => {
      setCustomers(fetchedCustomers);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {customers.length ? (
        <div className="container mx-auto md:mx-10 py-10">
          <DataTable columns={customerColumns} data={customers} />
        </div>
      ) : (
        <NoCustomersFoundMessage />
      )}
    </>
  );
};
