import { useNavigate } from "react-router-dom";
import { SharedButton } from "../../../components/ui/SharedButton/SharedButton";

export const ProjectsView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md gap-6">
        <h1 className="uppercase font-bold text-xl">Project CRUD</h1>
        <div className="flex flex-col gap-5">
          <SharedButton
            text="CREATE Project"
            onClick={() => {
              navigate("/projects/add");
            }}
          />
          <SharedButton
            text="READ Projects"
            onClick={() => {
              navigate("/projects/read");
            }}
          />
          <SharedButton
            text="UPDATE Project"
            onClick={() => {
              navigate("/projects/edit");
            }}
          />
          <SharedButton
            text="DELETE Project"
            onClick={() => {
              navigate("/projects/delete");
            }}
          />
        </div>
      </div>
    </div>
  );
};
