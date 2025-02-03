import { useNavigate } from "react-router-dom";
import { SharedButton } from "../../components/ui/SharedButton/SharedButton";

export const ProjectsView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md gap-6">
        <h1 className="uppercase font-bold text-xl">Project CRUD</h1>
        <div className="flex flex-col gap-5">
          <SharedButton
            text="CREATE Project"
            handleClick={() => {
              navigate("/projects/add");
            }}
          />
          <SharedButton
            text="READ Projects"
            handleClick={() => {
              navigate("/projects/read");
            }}
          />
          <SharedButton
            text="UPDATE Project"
            handleClick={() => {
              navigate("/projects/edit");
            }}
          />
          <SharedButton
            text="DELETE Project"
            handleClick={() => {
              navigate("/projects/delete");
            }}
          />
        </div>
      </div>
    </div>
  );
};
