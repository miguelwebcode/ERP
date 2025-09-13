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
      <label htmlFor={props.name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          {...field}
          {...props}
          id={props.name}
          className={`w-full p-3 pr-10 border-2 border-blue-300 rounded-full focus:border-blue-500 focus:outline-none transition-colors duration-200 appearance-none ${
            meta.error && meta.touched && "border-red-500"
          }`}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {meta.error && meta.touched && (
        <div className="text-red-500 text-sm text-left mt-1">{meta.error}</div>
      )}
    </div>
  );
};
