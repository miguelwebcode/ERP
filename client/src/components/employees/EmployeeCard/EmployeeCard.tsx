import { Employee } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import "@/styles/DataCard.css";
import { AppIcon } from "@/config/plugins/icons.plugin";

type EmployeeCardProps = {
  employee: Employee;
  onButtonClick: () => Promise<void>;
};
export const EmployeeCard = ({
  employee,
  onButtonClick: handleButtonClick,
}: EmployeeCardProps) => {
  return (
    <div className="card-container">
      <div className="card-id-section">
        <p>
          <span>ID</span>: {employee.id}
        </p>
      </div>
      <div className="card-grid">
        <CardField
          label="Name"
          value={employee.name}
          Icon={() => <AppIcon name={"personName"} />}
        />
        <CardField
          label="Role"
          value={employee.role}
          Icon={() => <AppIcon name={"role"} />}
        />
        <CardField
          label="Email"
          value={employee.email}
          Icon={() => <AppIcon name={"email"} />}
        />
        <CardField
          label="Phone"
          value={employee.phone}
          Icon={() => <AppIcon name={"phone"} />}
        />
        <CardField
          label="Address"
          value={employee.address}
          Icon={() => <AppIcon name={"address"} />}
        />
        <CardField
          label="Salary"
          value={`${employee.salary}€`}
          Icon={() => <AppIcon name={"salary"} />}
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
