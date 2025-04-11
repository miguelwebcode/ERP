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
        <EmployeeForm
          titleText="NEW CUSTOMER"
          submitButtonText="CREATE"
          onSubmit={handleCreateEmployee}
        />
      )}
    </>
  );
};
