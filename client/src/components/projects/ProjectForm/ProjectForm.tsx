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
      <div className="flex flex-col items-center justify-center bg-ds-white p-8 rounded shadow-ds-2">
        <h1 className="text-2xl font-bold mb-8">{titleText}</h1>
        <div className="grid grid-cols-2 gap-y-5 gap-x-5">
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="text"
              label="Name"
              name="name"
              placeholder="Enter project's name"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
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
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="text"
              label="Description"
              name="description"
              placeholder="Enter project's description"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="date"
              label="Start Date"
              name="startDate"
              placeholder="Enter project's startDate"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="text"
              label="Customer ID"
              name="customerId"
              placeholder="Enter project's customer"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="date"
              label="End Date"
              name="endDate"
              placeholder="Enter project's endDate"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
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
          className="w-full bg-ds-primary-500 text-ds-white mt-8 py-3 px-4 rounded hover:bg-ds-primary-600 uppercase font-bold disabled:bg-ds-grey-400"
          disabled={fieldDisabled}
        >
          <p className="text-xl">{submitButtonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default ProjectForm;
