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
      <div className="flex flex-col mb-4">
        <label htmlFor={props.name} className="block text-sm font-medium">
          {label}
        </label>
        <input
          {...field}
          {...props}
          id={props.name}
          className={`w-full p-2 border rounded ${
            meta.error && meta.touched && "border-red-500"
          }`}
        />
        {meta.error && meta.touched && (
          <div className="text-red-500 text-sm text-left mt-1">
            {meta.error}
          </div>
        )}
      </div>
    </>
  );
};
