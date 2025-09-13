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

  const isDatePlaceholder = field.value.length === 0;

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
          className={`w-full p-3 border-2 border-blue-300 rounded-full focus:border-blue-500 focus:outline-none transition-colors duration-200 ${
            meta.error && meta.touched && "border-ds-accent1-500"
          } ${isDatePlaceholder ? "text-gray-400" : "text-gray-800"}`}
        />
        {meta.error && meta.touched && (
          <div className="text-ds-accent1-500 text-sm text-left mt-1">
            {meta.error}
          </div>
        )}
      </div>
    </>
  );
};
