import { IconType } from "react-icons/lib";

type SharedButtonProps = {
  text: string;
  onClick: () => void;
  Icon?: IconType;
  className?: string;
};

export const SharedButton = ({
  text,
  onClick: handleClick,
  Icon,
  className,
}: SharedButtonProps) => {
  return (
    <button
      className={`bg-ds-primary-500 hover:bg-ds-primary-600 text-ds-white font-bold uppercase p-ds-8 rounded ${
        className && className
      } `}
      onClick={() => {
        handleClick();
      }}
    >
      <div className={`flex justify-center items-center ${Icon && "gap-ds-8"}`}>
        <div>{Icon && <Icon className="text-ds-xl" />}</div>
        <p className="text-ds-lg ">{text}</p>
      </div>
    </button>
  );
};
