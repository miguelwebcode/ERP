import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../ui/NavButton/NavButton";

export const EmployeesNavigationCard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-ds-24 bg-ds-white p-ds-32 rounded-ds-sm shadow-ds-2 w-ds-256">
      <h3 className="uppercase text-ds-lg font-bold text-center ">
        MANAGE EMPLOYEES
      </h3>
      <NavButton
        text="CREATE"
        Icon={FaPlus}
        activatedOnRoute="employees/add"
        onClick={() => {
          navigate("/employees/add");
        }}
      />
      <NavButton
        text="READ"
        Icon={IoReader}
        activatedOnRoute="employees/read"
        onClick={() => {
          navigate("/employees/read");
        }}
      />
      <NavButton
        text="UPDATE"
        Icon={MdEdit}
        activatedOnRoute="/employees/edit"
        onClick={() => {
          navigate("/employees/edit");
        }}
      />
      <NavButton
        text="DELETE"
        Icon={MdDeleteForever}
        activatedOnRoute="/employees/delete"
        onClick={() => {
          navigate("/employees/delete");
        }}
      />
    </div>
  );
};
