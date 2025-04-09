import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../ui/NavButton/NavButton";

export const CustomersNavigationCard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-ds-24 bg-ds-white p-ds-32 rounded-ds-sm shadow-ds-2 w-ds-256">
      <h3 className="uppercase text-ds-lg font-bold text-center ">
        MANAGE CUSTOMERS
      </h3>
      <NavButton
        text="CREATE"
        Icon={FaPlus}
        activatedOnRoute="customers/add"
        onClick={() => {
          navigate("/customers/add");
        }}
      />
      <NavButton
        text="READ"
        Icon={IoReader}
        activatedOnRoute="customers/read"
        onClick={() => {
          navigate("/customers/read");
        }}
      />
      <NavButton
        text="UPDATE"
        Icon={MdEdit}
        activatedOnRoute="/customers/edit"
        onClick={() => {
          navigate("/customers/edit");
        }}
      />
      <NavButton
        text="DELETE"
        Icon={MdDeleteForever}
        activatedOnRoute="/customers/delete"
        onClick={() => {
          navigate("/customers/delete");
        }}
      />
    </div>
  );
};
