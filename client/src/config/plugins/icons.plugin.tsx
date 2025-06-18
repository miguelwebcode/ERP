import { FaHome, FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

/*
    TODO: Add all used icons to iconMap
*/

// Mapea los nombres de iconos a los componentes reales
const iconMap = {
  home: FaHome,
  user: FaUser,
  logout: MdLogout,
  // ...agrega los que uses
};

export type IconName = keyof typeof iconMap;

type IconProps = {
  name: IconName;
  className?: string;
  size?: number | string;
  color?: string;
};

export function AppIcon({ name, className, size, color }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} color={color} />;
}
