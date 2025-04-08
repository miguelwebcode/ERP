import "@styles/NavButton.css";
import { IconType } from "react-icons/lib";

type NavButtonProps = {
  text: string;
  onClick: () => void;
  Icon?: IconType;
};

export const NavButton = ({
  text,
  onClick: handleClick,
  Icon,
}: NavButtonProps) => {
  return (
    <button
      className={"nav-button"}
      onClick={() => {
        handleClick();
      }}
    >
      <div className="flex justify-center items-center gap-ds-8">
        {Icon && (
          <span className="text-ds-primary-500">
            <Icon className="text-ds-xl" />
          </span>
        )}
        <p className="text-ds-lg font-semibold text-ds-primary-500 text-center">
          {text}
        </p>
      </div>
    </button>
  );
};
