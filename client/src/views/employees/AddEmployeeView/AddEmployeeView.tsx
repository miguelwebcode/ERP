import { useEffect, useState } from "react";
import EmployeeForm from "../../../components/employees/EmployeeForm/EmployeeForm";
import { handleCreateEmployee } from "../../../services/employees/repository/employeesRepository";
import { useAppStore } from "../../../stores/app-store";

export const AddEmployeeView = () => {
  const [isRenderDone, setIsRenderDone] = useState(false);

  const setSelectedEmployeeId = useAppStore(
    (state) => state.setSelectedEmployeeId
  );

  useEffect(() => {
    setSelectedEmployeeId("");
    setIsRenderDone(true);
  });
  return (
    <>
      {isRenderDone && (
        <div className="w-full max-w-[700px]">
          <EmployeeForm
            titleText="NEW EMPLOYEE"
            submitButtonText="CREATE"
            onSubmit={handleCreateEmployee}
          />
        </div>
      )}
    </>
  );
};
