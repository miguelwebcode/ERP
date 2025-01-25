import { useField } from "formik";
import { ReactNode } from "react";

type CustomSelectProps = {
  label: string;
  name: string;
  placeholder: string;
  children: ReactNode;
};

export const CustomSelect = ({
  label,
  children,
  ...props
}: CustomSelectProps) => {
  const [field, meta] = useField(props);
  console.log("field", field);
  console.log("meta", meta);

  return (
    <>
      <label htmlFor={props.name}>{label}</label>
      <select
        {...field}
        {...props}
        className={meta.error && meta.touched ? "input-error" : ""}
      >
        {children}
      </select>
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </>
  );
};
