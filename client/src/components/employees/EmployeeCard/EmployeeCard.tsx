import { Employee } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { MdOutlineEmail, MdOutlinePhoneEnabled } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";

type EmployeeCardProps = {
  employee: Employee;
};
export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  return (
    <div className="w-ds-384">
      <div className="bg-ds-secondary-900 h-ds-32 rounded-t-ds-sm flex items-center justify-center">
        <p className="text-ds-white text-center">
          <span className="font-semibold">ID</span>: {employee.id}
        </p>
      </div>
      <div className="grid grid-cols-2 p-ds-20 gap-y-ds-20 gap-x-ds-12">
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
        <CardField label="Salary" value={employee.salary} Icon={TbPigMoney} />
      </div>
    </div>
  );
};
