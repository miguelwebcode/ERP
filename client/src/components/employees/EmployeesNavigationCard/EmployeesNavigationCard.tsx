import { NavButton } from "../../ui/NavButton/NavButton";
import { AppIcon } from "@/config/plugins/icons.plugin";

export const EmployeesNavigationCard = () => {
  return (
    <div className="flex flex-col gap-6 bg-ds-white p-8 rounded shadow-ds-2 w-64">
      <h3 className="uppercase text-xl font-bold text-center ">
        MANAGE EMPLOYEES
      </h3>
      <NavButton
        text="CREATE"
        Icon={() => <AppIcon name={"create"} />}
        route="/employees/add"
      />
      <NavButton
        text="READ"
        Icon={() => <AppIcon name={"read"} />}
        route="/employees/read"
      />
      <NavButton
        text="UPDATE"
        Icon={() => <AppIcon name={"update"} />}
        route="/employees/edit"
      />
      <NavButton
        text="DELETE"
        Icon={() => <AppIcon name={"delete"} />}
        route="/employees/delete"
      />
    </div>
  );
};
