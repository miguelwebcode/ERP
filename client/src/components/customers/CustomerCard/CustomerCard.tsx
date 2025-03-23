import { Customer } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { FaRegBuilding } from "react-icons/fa";
import {
  MdCalendarMonth,
  MdOutlineEditCalendar,
  MdOutlineEmail,
  MdOutlinePhoneEnabled,
} from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";

type CustomerCardProps = {
  customer: Customer;
};
export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <div className="flex gap-10">
      <div className="flex flex-col">
        <CardField label="Name" value={customer.name} Icon={LuUserRound} />
        <CardField
          label="Address"
          value={customer.address}
          Icon={IoLocationOutline}
        />
        <CardField label="Email" value={customer.email} Icon={MdOutlineEmail} />
        <CardField
          label="Phone"
          value={customer.phone}
          Icon={MdOutlinePhoneEnabled}
        />
      </div>
      <div className="flex flex-col">
        <CardField
          label="Company"
          value={customer.company}
          Icon={FaRegBuilding}
        />
        <CardField
          label="Project"
          value={customer.project}
          Icon={MdOutlineWorkOutline}
        />
        <CardField
          label="Created at"
          value={customer.createdAt}
          Icon={MdCalendarMonth}
        />
        {customer.updatedAt && (
          <CardField
            label="Updated at"
            value={customer.updatedAt}
            Icon={MdOutlineEditCalendar}
          />
        )}
      </div>
    </div>
  );
};
