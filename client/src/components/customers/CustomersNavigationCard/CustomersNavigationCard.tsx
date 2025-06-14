import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { NavButton } from "../../ui/NavButton/NavButton";

export const CustomersNavigationCard = () => {
  return (
    <div className="flex flex-col gap-6 bg-ds-white p-8 rounded shadow-ds-2 w-64">
      <h3 className="uppercase text-xl font-bold text-center ">
        MANAGE CUSTOMERS
      </h3>
      <NavButton text="CREATE" Icon={FaPlus} route="/customers/add" />
      <NavButton text="READ" Icon={IoReader} route="/customers/read" />
      <NavButton text="UPDATE" Icon={MdEdit} route="/customers/edit" />
      <NavButton
        text="DELETE"
        Icon={MdDeleteForever}
        route="/customers/delete"
      />
    </div>
  );
};
