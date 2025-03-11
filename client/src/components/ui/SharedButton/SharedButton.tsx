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
      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold uppercase p-2 rounded-lg ${
        className && className
      } `}
      onClick={() => {
        handleClick();
      }}
    >
      <div className="flex justify-center items-center gap-2">
        <div>{Icon && <Icon className="text-xl" />}</div>
        <div>{text}</div>
      </div>
    </button>
  );
};
