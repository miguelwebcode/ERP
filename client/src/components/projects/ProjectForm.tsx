import { FormikHelpers, FormikProps } from "formik";
import SharedForm from "../formik/SharedForm";
import { projectFormValidationSchema } from "../../schemas";
import { CustomInput } from "../formik/CustomInput";
import { CustomSelect } from "../formik/CustomSelect";
import { projectStates } from "../../data";
import { ProjectFormValues } from "../../types/form-values-types";
import { useEffect, useMemo, useRef } from "react";
import { getProjectById } from "../../services/projects";
import { useAppStore } from "../../stores/app-store";

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
    description: "",
    startDate: "",
    endDate: "",
    name: "",
    state: "",
    developer: "",
  };

  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  useEffect(() => {
    const setFormValues = async (formik: FormikProps<ProjectFormValues>) => {
      const selectedProject = await getProjectById(selectedProjectId);
      if (selectedProject) {
        const newValues: ProjectFormValues = {
          description: selectedProject["description"],
          startDate: selectedProject["startDate"],
          endDate: selectedProject["endDate"],
          name: selectedProject["name"],
          state: selectedProject["state"],
          developer: selectedProject["developer"],
        };
        formik.setValues(newValues);
      }
    };
    if (formikRef.current) {
      setFormValues(formikRef.current);
    }
  }, [selectedProjectId]);

  const fieldDisabled = useMemo(
    () => canBeDisabled && selectedProjectId === "",
    [selectedProjectId]
  );

  return (
    <SharedForm<ProjectFormValues>
      initialValues={initialValues}
      validationSchema={projectFormValidationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">{titleText}</h1>
        <div className="w-4/5">
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
            type="text"
            label="Assigned Developer"
            name="developer"
            placeholder="Enter project's assigned developer"
            disabled={fieldDisabled}
          />
        </div>
        <button
          type="submit"
          className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={fieldDisabled}
        >
          {submitButtonText}
        </button>
      </div>
    </SharedForm>
  );
};

export default ProjectForm;
