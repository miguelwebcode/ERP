import {
  Users,
  FolderKanban,
  UserCircle,
  LucideLogOut,
  DollarSign,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { logout } from "@/services/auth/service/authService";
import { useLocation } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";

// Menu items.
const items = [
  {
    title: "Stripe",
    url: "/stripe/products",
    icon: DollarSign,
  },
  {
    title: "Dashboard",
    url: "/",
    icon: MdDashboardCustomize,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: UserCircle,
  },
  {
    title: "Logout",
    url: "/login",
    icon: LucideLogOut,
    onClick: () => {
      logout();
    },
  },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === "/" && location.pathname === "/") return true;
    if (url !== "/" && location.pathname.startsWith(url)) return true;
    return false;
  };

  return (
    <Sidebar collapsible="icon" className="bg-blue-900 border-r-0">
      <SidebarHeader className="hidden md:block bg-blue-900">
        <SidebarTrigger className="text-white hover:bg-blue-900" />
      </SidebarHeader>
      <SidebarContent className="bg-blue-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-semibold">
            FIRERP
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      onClick={item.onClick && item.onClick}
                      className={`text-white flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive(item.url)
                          ? "bg-blue-600 hover:bg-blue-600"
                          : "hover:bg-white hover:text-blue-800"
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
