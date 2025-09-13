import { useEffect, useState } from "react";
import { fetchAllCustomers } from "../../../services/customers/service/customersService";
import { Customer } from "../../../types";
import { NoCustomersFoundMessage } from "../../../components/customers/NoCustomersFoundMessage/NoCustomersFoundMessage";
import { MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/stores/app-store";
import { useNavigate } from "react-router-dom";

const CustomerActions = ({ customer }: { customer: Customer }) => {
  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(customer.id)}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy customer ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedCustomerId(customer.id);
            navigate("/customers/edit");
          }}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit customer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedCustomerId(customer.id);
            navigate("/customers/delete");
          }}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete customer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ReadCustomersView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 8;

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
          <div className="rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 font-medium">Address</th>
                  <th className="text-left py-3 px-4 font-medium">Company</th>
                </tr>
              </thead>
              <tbody>
                {customers
                  .slice(
                    (currentPage - 1) * customersPerPage,
                    currentPage * customersPerPage
                  )
                  .map((customer, index) => (
                    <tr
                      key={customer.id || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="py-3 px-4">
                        <CustomerActions customer={customer} />
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {customer.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {customer.email}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {customer.phone}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {customer.address}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium">
                        {customer.company}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {customers.length > 0 && (
              <div className="border-t border-gray-200 bg-white">
                <div className="flex items-center justify-between py-3 px-4 text-sm text-gray-500">
                  <div>
                    Showing {(currentPage - 1) * customersPerPage + 1}-
                    {Math.min(currentPage * customersPerPage, customers.length)}{" "}
                    of {customers.length} customers
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </button>
                    <span className="text-gray-600">
                      Page {currentPage} of{" "}
                      {Math.ceil(customers.length / customersPerPage)}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(customers.length / customersPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(customers.length / customersPerPage)
                      }
                      className="flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <NoCustomersFoundMessage />
      )}
    </>
  );
};
