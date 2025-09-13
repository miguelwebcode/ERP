import { useState, useEffect } from "react";
import { Project } from "../../../types";
import { fetchAllProjects } from "../../../services/projects/service/projectsService";
import { NoProjectsFoundMessage } from "../../../components/projects/NoProjectsFoundMessage.tsx/NoProjectsFoundMessage";
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
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(project.id)}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy project ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedProjectId(project.id);
            navigate("/projects/edit");
          }}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit project
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedProjectId(project.id);
            navigate("/projects/delete");
          }}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ReadProjectsView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;

  useEffect(() => {
    fetchAllProjects((fetchedProjects) => {
      setProjects(fetchedProjects);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {projects.length ? (
        <div className="container mx-auto md:mx-10 py-10">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Project Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium">State</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Start Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium">End Date</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Customer ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Employee ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects
                  .slice(
                    (currentPage - 1) * projectsPerPage,
                    currentPage * projectsPerPage
                  )
                  .map((project, index) => (
                    <tr
                      key={project.id || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="py-3 px-4">
                        <ProjectActions project={project} />
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {project.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {project.state}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {project.description}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(project.startDate).toLocaleDateString(
                          "es-ES"
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(project.endDate).toLocaleDateString("es-ES")}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {project.customerId}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium">
                        {project.employeeId}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {projects.length > 0 && (
              <div className="border-t border-gray-200 bg-white">
                <div className="flex items-center justify-between py-3 px-4 text-sm text-gray-500">
                  <div>
                    Showing {(currentPage - 1) * projectsPerPage + 1}-
                    {Math.min(currentPage * projectsPerPage, projects.length)}{" "}
                    of {projects.length} projects
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
                      {Math.ceil(projects.length / projectsPerPage)}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(projects.length / projectsPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(projects.length / projectsPerPage)
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
        <NoProjectsFoundMessage />
      )}
    </>
  );
};
