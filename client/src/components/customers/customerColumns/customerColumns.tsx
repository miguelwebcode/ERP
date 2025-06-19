import { Customer } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
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
import { AppIcon } from "@/config/plugins/icons.plugin";

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
          <AppIcon name="moreOptions" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(customer.id)}
        >
          <AppIcon name="copy" className="mr-2 h-4 w-4" /> Copy customer ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedCustomerId(customer.id);
            navigate("/customers/edit");
          }}
        >
          <AppIcon name="edit" className="mr-2 h-4 w-4" /> Edit customer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedCustomerId(customer.id);
            navigate("/customers/delete");
          }}
        >
          <AppIcon name="trash" className="mr-2 h-4 w-4" /> Delete customer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const customerColumns: ColumnDef<Customer>[] = [
  {
    id: "actions",
    cell: ({ row }) => <CustomerActions customer={row.original} />,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
