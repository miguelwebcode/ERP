import { useField } from "formik";

type CustomInputProps = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
};

export const CustomInput = ({ label, ...props }: CustomInputProps) => {
  const [field, meta] = useField(props);

  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={props.name} className="block text-sm font-medium">
          {label}
        </label>
        <input
          {...field}
          {...props}
          id={props.name}
          className={`w-full p-ds-8 border rounded-ds-sm ${
            meta.error && meta.touched && "border-ds-accent1-500"
          }`}
        />
        {meta.error && meta.touched && (
          <div className="text-ds-accent1-500 text-ds-sm text-left mt-ds-4">
            {meta.error}
          </div>
        )}
      </div>
    </>
  );
};
