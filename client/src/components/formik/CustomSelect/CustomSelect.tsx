import { useField } from "formik";
import { ReactNode } from "react";

type CustomSelectProps = {
  label: string;
  name: string;
  children: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const CustomSelect = ({
  label,
  children,
  ...props
}: CustomSelectProps) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={props.name} className="block text-sm font-medium">
        {label}
      </label>
      <select
        {...field}
        {...props}
        id={props.name}
        className={`w-full p-2 border rounded ${
          meta.error && meta.touched && "border-red-500"
        }`}
      >
        {children}
      </select>
      {meta.error && meta.touched && (
        <div className="text-red-500 text-sm text-left mt-1">
          {meta.error}
        </div>
      )}
    </div>
  );
};
