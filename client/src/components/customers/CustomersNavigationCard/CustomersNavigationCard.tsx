import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { NavButton } from "../../ui/NavButton/NavButton";

export const CustomersNavigationCard = () => {
  return (
    <div className="flex flex-col gap-ds-24 bg-ds-white p-ds-32 rounded shadow-ds-2 w-ds-256">
      <h3 className="uppercase text-ds-lg font-bold text-center ">
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
