import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";

export const EmployeesNavigationCard = () => {
  return (
    <div className="flex flex-col gap-6 rounded-lg p-8 w-80">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
        MANAGE EMPLOYEES
      </h3>
      <div className="space-y-4">
        <a
          href="/employees/add"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-3 shadow-md"
        >
          <FaPlus className="text-lg" />
          CREATE
        </a>
        <a
          href="/employees/read"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-3 shadow-md"
        >
          <IoReader className="text-lg" />
          READ
        </a>
        <a
          href="/employees/edit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-3 shadow-md"
        >
          <MdEdit className="text-lg" />
          UPDATE
        </a>
        <a
          href="/employees/delete"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-3 shadow-md"
        >
          <MdDeleteForever className="text-lg" />
          DELETE
        </a>
      </div>
    </div>
  );
};
