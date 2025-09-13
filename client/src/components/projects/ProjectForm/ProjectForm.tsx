import { FormikHelpers, FormikProps } from "formik";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { projectFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../../formik/CustomInput/CustomInput";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import { projectStates } from "../../../data";
import { ProjectFormValues } from "../../../types/form-values-types";
import { useEffect, useMemo, useRef } from "react";
import { setProjectFormValues } from "../../../services/projects/service/projectsService";
import { useAppStore } from "../../../stores/app-store";

type ProjectFormProps = {
  titleText: string;
  submitButtonText: string;
  onSubmit: (
    values: ProjectFormValues,
    formikHelpers: FormikHelpers<ProjectFormValues>
  ) => void;
  canBeDisabled?: boolean;
};

const ProjectForm = ({
  titleText,
  submitButtonText,
  onSubmit: handleSubmit,
  canBeDisabled,
}: ProjectFormProps) => {
  const formikRef = useRef<FormikProps<ProjectFormValues>>(null);

  const initialValues: ProjectFormValues = {
    name: "",
    state: "",
    description: "",
    startDate: "",
    customerId: "",
    endDate: "",
    employeeId: "",
  };

  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  useEffect(() => {
    /* 
     On first useEffect, form is not mounted yet, its reference formikRef.current
     is null. Then, on selectedCustomerId change, useEffect is executed again...
     this second time form is rendered, so it executes the function inside if statement 
    */
    if (formikRef.current) {
      setProjectFormValues(formikRef.current, selectedProjectId);
    }
  }, [selectedProjectId]);

  const fieldDisabled = useMemo(
    () => canBeDisabled && selectedProjectId === "",
    [selectedProjectId]
  );

  /* 
   TODO: 
   - Assigned Developer as CustomSelect, fetch developers from firebase
   - Customer ID as CustomSelect, fetch customer ids from firebase
  */

  return (
    <SharedForm<ProjectFormValues>
      initialValues={initialValues}
      validationSchema={projectFormValidationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <div className="w-fullpx-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
          {titleText}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CustomInput
              type="text"
              label="Name"
              name="name"
              placeholder="Enter project's name"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomSelect
              label="Project State"
              name="state"
              disabled={fieldDisabled}
            >
              <option className="text-center" value="">
                -- Select an option --
              </option>
              {projectStates.map((projectState) => {
                return (
                  <option key={projectState.id} value={projectState.id}>
                    {projectState.value}
                  </option>
                );
              })}
            </CustomSelect>
          </div>
          <div className="md:col-span-2">
            <CustomInput
              type="text"
              label="Description"
              name="description"
              placeholder="Enter project's description"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="date"
              label="Start Date"
              name="startDate"
              placeholder="Enter project's startDate"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="date"
              label="End Date"
              name="endDate"
              placeholder="Enter project's endDate"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="text"
              label="Customer ID"
              name="customerId"
              placeholder="Enter project's customer"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="text"
              label="Employee ID"
              name="employeeId"
              placeholder="Enter project's employee"
              disabled={fieldDisabled}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-8 py-3 px-6 rounded-lg transition-colors duration-200 font-medium disabled:bg-gray-400"
          disabled={fieldDisabled}
        >
          <p className="text-xl">{submitButtonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default ProjectForm;
