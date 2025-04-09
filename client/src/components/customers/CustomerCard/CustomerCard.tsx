import { Customer } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineEmail, MdOutlinePhoneEnabled } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";

type CustomerCardProps = {
  customer: Customer;
};
export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <div className="w-ds-384">
      <div className="bg-ds-secondary-900 h-ds-32 rounded-t-ds-sm flex items-center justify-center">
        <p className="text-ds-white text-center">
          <span className="font-semibold">ID</span>: {customer.id}
        </p>
      </div>
      <div className="grid grid-cols-2 p-ds-20 gap-y-ds-20 gap-x-ds-12">
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
    </div>
  );
};
