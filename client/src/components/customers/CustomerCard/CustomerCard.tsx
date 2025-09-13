import { Customer } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineEmail, MdOutlinePhoneEnabled } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";

type CustomerCardProps = {
  customer: Customer;
  onButtonClick: () => Promise<void>;
};
export const CustomerCard = ({
  customer,
  onButtonClick: handleButtonClick,
}: CustomerCardProps) => {
  return (
    <div className="w-full max-w-md p-6">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-600">
          <span className="font-semibold">ID</span>: {customer.id}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <CardField label="Name" value={customer.name} Icon={LuUserRound} />
        <CardField
          label="Company"
          value={customer.company}
          Icon={FaRegBuilding}
        />
        <CardField
          label="Address"
          value={customer.address}
          Icon={IoLocationOutline}
        />
        <CardField
          label="Phone"
          value={customer.phone}
          Icon={MdOutlinePhoneEnabled}
        />
        <CardField label="Email" value={customer.email} Icon={MdOutlineEmail} />
      </div>
      <div className="flex justify-center">
        <button
          className="w-full bg-red-500 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
          onClick={() => handleButtonClick()}
        >
          <p className="text-xl">DELETE</p>
        </button>
      </div>
    </div>
  );
};
