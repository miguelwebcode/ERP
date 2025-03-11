import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { SharedButton } from "../../ui/SharedButton/SharedButton";
import { useNavigate } from "react-router-dom";

export const CustomersNavigationCard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded shadow-md min-w-[300px]">
      <h3 className="uppercase font-bold text-center text-xl">
        MANAGE CUSTOMERS
      </h3>
      <div className="flex justify-around gap-6">
        <SharedButton
          className="flex-1 px-4"
          text="CREATE"
          Icon={FaPlus}
          onClick={() => {
            navigate("/customers/add");
          }}
        />
        <SharedButton
          className="flex-1 px-4"
          text="READ"
          Icon={IoReader}
          onClick={() => {
            navigate("/customers/read");
          }}
        />
      </div>
      <div className="flex justify-around gap-6">
        <SharedButton
          className="flex-1 px-4"
          text="UPDATE"
          Icon={MdEdit}
          onClick={() => {
            navigate("/customers/edit");
          }}
        />
        <SharedButton
          className="flex-1 px-4"
          text="DELETE"
          Icon={MdDeleteForever}
          onClick={() => {
            navigate("/customers/delete");
          }}
        />
      </div>
    </div>
  );
};
