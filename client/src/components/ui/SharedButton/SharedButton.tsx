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
      className={`bg-ds-primary-500 hover:bg-ds-primary-600 text-ds-white font-bold uppercase p-2 rounded ${
        className && className
      } `}
      onClick={() => {
        handleClick();
      }}
    >
      <div className={`flex justify-center items-center ${Icon && "gap-2"}`}>
        <div>{Icon && <Icon className="text-2xl" />}</div>
        <p className="text-xl ">{text}</p>
      </div>
    </button>
  );
};
