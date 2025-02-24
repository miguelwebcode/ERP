type CardFieldProps = {
  label: string;
  value: string;
};

export const CardField = ({ label, value }: CardFieldProps) => {
  return (
    <div className="flex flex-col mb-4 gap-1 ">
      <label className="block text-sm font-medium">{label}</label>
      <span data-testid={label} className="text-md">
        {value}
      </span>
    </div>
  );
};
