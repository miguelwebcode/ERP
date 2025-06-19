import {
  Box,
  Check,
  ChevronRight,
  Circle,
  Copy,
  DollarSign,
  Edit,
  FolderKanban,
  Globe,
  Home,
  LucideLogOut,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Trash,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { BsFileBarGraph } from "react-icons/bs";
import { FaPlus, FaRegBuilding } from "react-icons/fa";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoReader,
} from "react-icons/io5";
import { LiaGripfire } from "react-icons/lia";
import { LuUserRound } from "react-icons/lu";
import {
  MdDeleteForever,
  MdEdit,
  MdOutlineCategory,
  MdOutlineDescription,
  MdOutlineEmail,
  MdOutlinePhoneEnabled,
  MdOutlineWorkOutline,
} from "react-icons/md";
import { PiIdentificationBadge } from "react-icons/pi";
import { TbPigMoney } from "react-icons/tb";

const iconMap = {
  create: FaPlus,
  read: IoReader,
  update: MdEdit,
  delete: MdDeleteForever,
  personName: LuUserRound,
  company: FaRegBuilding,
  address: IoLocationOutline,
  phone: MdOutlinePhoneEnabled,
  email: MdOutlineEmail,
  role: MdOutlineCategory,
  salary: TbPigMoney,
  projectName: MdOutlineWorkOutline,
  description: MdOutlineDescription,
  customerId: PiIdentificationBadge,
  employeeId: LuUserRound,
  state: BsFileBarGraph,
  startDate: IoCalendarOutline,
  endDate: IoCalendarOutline,
  appLogo: LiaGripfire,
  copy: Copy,
  trash: Trash,
  edit: Edit,
  moreOptions: MoreHorizontal,
  home: Home,
  customers: Users,
  projects: FolderKanban,
  employees: UserCircle,
  logout: LucideLogOut,
  stripe: DollarSign,
  stripeProducts: Box,
  stripePortal: Globe,
  panelOpen: PanelLeftOpen,
  panelClose: PanelLeftClose,
  close: X,
  check: Check,
  circle: Circle,
  chevronRight: ChevronRight,
};

export type IconName = keyof typeof iconMap;

type IconProps = {
  name: IconName;
  className?: string;
  size?: number | string;
  color?: string;
};

export const AppIcon = ({
  name,
  className = "text-xl text-ds-grey-800",
  size,
  color,
}: IconProps) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} color={color} />;
};
