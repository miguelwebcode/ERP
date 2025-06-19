import { NavButton } from "../../ui/NavButton/NavButton";
import { AppIcon } from "@/config/plugins/icons.plugin";

export const ProjectsNavigationCard = () => {
  return (
    <div className="flex flex-col gap-6 bg-ds-white p-8 rounded shadow-ds-2 w-64">
      <h3 className="uppercase text-xl font-bold text-center ">
        MANAGE PROJECTS
      </h3>
      <NavButton
        text="CREATE"
        Icon={() => <AppIcon name={"create"} />}
        route="/projects/add"
      />
      <NavButton
        text="READ"
        Icon={() => <AppIcon name={"read"} />}
        route="/projects/read"
      />
      <NavButton
        text="UPDATE"
        Icon={() => <AppIcon name={"update"} />}
        route="/projects/edit"
      />
      <NavButton
        text="DELETE"
        Icon={() => <AppIcon name={"delete"} />}
        route="/projects/delete"
      />
    </div>
  );
};
