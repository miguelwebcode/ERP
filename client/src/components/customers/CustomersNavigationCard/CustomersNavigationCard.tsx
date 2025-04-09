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
        onClick={() => {
          navigate("/customers/add");
        }}
      />
      <NavButton
        text="READ"
        Icon={IoReader}
        onClick={() => {
          navigate("/customers/read");
        }}
      />
      <NavButton
        text="UPDATE"
        Icon={MdEdit}
        onClick={() => {
          navigate("/customers/edit");
        }}
      />
      <NavButton
        text="DELETE"
        Icon={MdDeleteForever}
        onClick={() => {
          navigate("/customers/delete");
        }}
      />
    </div>
  );
};
