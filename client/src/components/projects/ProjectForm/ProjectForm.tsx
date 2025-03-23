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
    customerId: "",
    description: "",
    startDate: "",
    endDate: "",
    name: "",
    state: "",
    developer: "",
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
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-8">{titleText}</h1>
        <div className="flex flex-col sm:flex-row sm:gap-10">
          <div className="flex flex-col w-64">
            <CustomInput
              type="text"
              label="Name"
              name="name"
              placeholder="Enter project's name"
              disabled={fieldDisabled}
            />
            <CustomInput
              type="text"
              label="Description"
              name="description"
              placeholder="Enter project's description"
              disabled={fieldDisabled}
            />
            <CustomInput
              type="text"
              label="Customer ID"
              name="customerId"
              placeholder="Enter project's customer id"
              disabled={fieldDisabled}
            />
            <CustomInput
              type="text"
              label="Assigned Developer"
              name="developer"
              placeholder="Enter project's developer"
              disabled={fieldDisabled}
            />
          </div>
          <div className="flex flex-col w-fit">
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
            <CustomInput
              type="date"
              label="Start Date"
              name="startDate"
              placeholder="Enter project's startDate"
              disabled={fieldDisabled}
            />
            <CustomInput
              type="date"
              label="End Date"
              name="endDate"
              placeholder="Enter project's endDate"
              disabled={fieldDisabled}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-fit bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 uppercase font-bold disabled:bg-gray-500"
          disabled={fieldDisabled}
        >
          {submitButtonText}
        </button>
      </div>
    </SharedForm>
  );
};

export default ProjectForm;
