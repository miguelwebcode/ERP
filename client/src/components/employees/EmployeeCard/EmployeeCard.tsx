import { Employee } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { MdOutlineEmail, MdOutlinePhoneEnabled } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";

type EmployeeCardProps = {
  employee: Employee;
  onButtonClick: () => Promise<void>;
};
export const EmployeeCard = ({
  employee,
  onButtonClick: handleButtonClick,
}: EmployeeCardProps) => {
  return (
    <div className="w-full max-w-md p-6">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-600">
          <span className="font-semibold">ID</span>: {employee.id}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6">
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
