import { IconType } from "react-icons/lib";

type CardFieldProps = {
  label: string;
  value: string;
  Icon?: IconType;
};

export const CardField = ({ label, value, Icon }: CardFieldProps) => {
  return (
    <div className="flex flex-col mb-4 gap-1 ">
      <div className="flex gap-2 items-center">
        {Icon && (
          <div>
            <Icon className="text-lg" />
          </div>
        )}
        <label className="block text-sm font-medium">{label}</label>
      </div>
      <span data-testid={label} className="text-md">
        {value}
      </span>
    </div>
  );
};
