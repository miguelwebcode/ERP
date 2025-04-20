import "@/styles/NavButton.css";
import { IconType } from "react-icons/lib";
import { useLocation } from "react-router-dom";

type NavButtonProps = {
  text: string;
  route: string;
  Icon?: IconType;
};

export const NavButton = ({ text, route, Icon }: NavButtonProps) => {
  const { pathname: currentRoute } = useLocation();

  return (
    <a
      href={route}
      className={
        currentRoute.includes(route) ? "activated-on-route" : "nav-button"
      }
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
    </a>
  );
};
