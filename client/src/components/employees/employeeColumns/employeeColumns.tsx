import { Employee } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
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

const EmployeeActions = ({ employee }: { employee: Employee }) => {
  const setSelectedEmployeeId = useAppStore(
    (state) => state.setSelectedEmployeeId
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
          onClick={() => navigator.clipboard.writeText(employee.id)}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy employee ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedEmployeeId(employee.id);
            navigate("/employees/edit");
          }}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit employee
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedEmployeeId(employee.id);
            navigate("/employees/delete");
          }}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete employee
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    id: "actions",
    cell: ({ row }) => <EmployeeActions employee={row.original} />,
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
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"));
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(amount);

      return formatted;
    },
  },
];
