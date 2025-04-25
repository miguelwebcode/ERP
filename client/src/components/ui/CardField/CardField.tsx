import { IconType } from "react-icons/lib";

type CardFieldProps = {
  label: string;
  value: string;
  Icon?: IconType;
};

export const CardField = ({ label, value, Icon }: CardFieldProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-start">
        {Icon && (
          <div>
            <Icon className="text-xl text-ds-grey-800" />
          </div>
        )}
        <label className="block text-sm font-medium text-ds-grey-400">
          {label}
        </label>
      </div>
      <span data-testid={label} className="text-md truncate" title={value}>
        {value}
      </span>
    </div>
  );
};
