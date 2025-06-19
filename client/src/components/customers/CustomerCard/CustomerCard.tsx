import { Customer } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import "@/styles/DataCard.css";
import { AppIcon } from "@/config/plugins/icons.plugin";

type CustomerCardProps = {
  customer: Customer;
  onButtonClick: () => Promise<void>;
};
export const CustomerCard = ({
  customer,
  onButtonClick: handleButtonClick,
}: CustomerCardProps) => {
  return (
    <div className="card-container">
      <div className="card-id-section">
        <p>
          <span>ID</span>: {customer.id}
        </p>
      </div>
      <div className="card-grid">
        <CardField
          label="Name"
          value={customer.name}
          Icon={() => <AppIcon name={"personName"} />}
        />
        <CardField
          label="Company"
          value={customer.company}
          Icon={() => <AppIcon name={"company"} />}
        />
        <CardField
          label="Address"
          value={customer.address}
          Icon={() => <AppIcon name={"address"} />}
        />
        <CardField
          label="Phone"
          value={customer.phone}
          Icon={() => <AppIcon name={"phone"} />}
        />
        <CardField
          label="Email"
          value={customer.email}
          Icon={() => <AppIcon name={"email"} />}
        />
      </div>
      <div className="flex justify-center mb-6 mx-5">
        <button className="form-button" onClick={() => handleButtonClick()}>
          <p className="text-xl">DELETE</p>
        </button>
      </div>
    </div>
  );
};
