import { Customer } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineEmail, MdOutlinePhoneEnabled } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import "@/styles/DataCard.css";

type CustomerCardProps = {
  customer: Customer;
};
export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <div className="card-container">
      <div className="card-id-section">
        <p>
          <span>ID</span>: {customer.id}
        </p>
      </div>
      <div className="card-grid">
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
