import { useNavigate } from "react-router-dom";
import { SharedButton } from "../../../components/ui/SharedButton/SharedButton";

export const ProjectsView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="uppercase font-bold text-3xl">PROJECTS</h1>

      <div className="flex flex-col gap-6 bg-white p-6 rounded shadow-md min-w-[300px]">
        <h3 className="uppercase font-bold text-center text-xl">
          MANAGE PROJECTS
        </h3>
        <div className="flex justify-around">
          <SharedButton
            className="w-24 px-4"
            text="CREATE"
            onClick={() => {
              navigate("/projects/add");
            }}
          />
          <SharedButton
            className="w-24"
            text="READ"
            onClick={() => {
              navigate("/projects/read");
            }}
          />
        </div>
        <div className="flex justify-around">
          <SharedButton
            className="w-24 px-4"
            text="UPDATE"
            onClick={() => {
              navigate("/projects/edit");
            }}
          />
          <SharedButton
            className="w-24 px-4"
            text="DELETE"
            onClick={() => {
              navigate("/projects/delete");
            }}
          />
        </div>
      </div>
    </div>
  );
};
