import { Employee } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { MdOutlineEmail, MdOutlinePhoneEnabled } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";
import "@/styles/DataCard.css";

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
        <CardField label="Name" value={employee.name} Icon={LuUserRound} />
        <CardField
          label="Role"
          value={employee.role}
          Icon={MdOutlineCategory}
        />
        <CardField label="Email" value={employee.email} Icon={MdOutlineEmail} />
        <CardField
          label="Phone"
          value={employee.phone}
          Icon={MdOutlinePhoneEnabled}
        />
        <CardField
          label="Address"
          value={employee.address}
          Icon={IoLocationOutline}
        />
        <CardField
          label="Salary"
          value={`${employee.salary}€`}
          Icon={TbPigMoney}
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
