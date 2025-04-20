import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { NavButton } from "../../ui/NavButton/NavButton";

export const EmployeesNavigationCard = () => {
  return (
    <div className="flex flex-col gap-ds-24 bg-ds-white p-ds-32 rounded shadow-ds-2 w-ds-256">
      <h3 className="uppercase text-ds-lg font-bold text-center ">
        MANAGE EMPLOYEES
      </h3>
      <NavButton text="CREATE" Icon={FaPlus} route="/employees/add" />
      <NavButton text="READ" Icon={IoReader} route="/employees/read" />
      <NavButton text="UPDATE" Icon={MdEdit} route="/employees/edit" />
      <NavButton
        text="DELETE"
        Icon={MdDeleteForever}
        route="/employees/delete"
      />
    </div>
  );
};
