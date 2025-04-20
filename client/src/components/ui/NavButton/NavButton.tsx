import "@styles/NavButton.css";
import { IconType } from "react-icons/lib";
import { useLocation, useNavigate } from "react-router-dom";

type NavButtonProps = {
  text: string;
  route: string;
  Icon?: IconType;
};

export const NavButton = ({ text, route, Icon }: NavButtonProps) => {
  const { pathname: currentRoute } = useLocation();
  const navigate = useNavigate();

  return (
    <button
      className={
        currentRoute.includes(route) ? "activated-on-route" : "nav-button"
      }
      onClick={() => {
        navigate(route);
      }}
    >
      <div className="flex justify-center items-center gap-2">
        {Icon && (
          <span className="text-ds-primary-500">
            <Icon className="text-2xl" />
          </span>
        )}
        <p className="text-xl font-semibold text-ds-primary-500 text-center">
          {text}
        </p>
      </div>
    </button>
  );
};
