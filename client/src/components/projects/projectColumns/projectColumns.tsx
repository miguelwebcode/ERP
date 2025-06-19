import { Project } from "@/types";
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

const ProjectActions = ({ project }: { project: Project }) => {
  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
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
          onClick={() => navigator.clipboard.writeText(project.id)}
        >
          <AppIcon name="copy" className="mr-2 h-4 w-4" /> Copy project ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedProjectId(project.id);
            navigate("/projects/edit");
          }}
        >
          <AppIcon name="edit" className="mr-2 h-4 w-4" /> Edit project
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedProjectId(project.id);
            navigate("/projects/delete");
          }}
        >
          <AppIcon name="trash" className="mr-2 h-4 w-4" /> Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const projectColumns: ColumnDef<Project>[] = [
  {
    id: "actions",
    cell: ({ row }) => <ProjectActions project={row.original} />,
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
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return date.toLocaleDateString("es-ES");
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return date.toLocaleDateString("es-ES");
    },
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
];
