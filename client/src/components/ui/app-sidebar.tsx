import {
  Home,
  Users,
  FolderKanban,
  UserCircle,
  LucideLogOut,
  DollarSign,
  Box,
  Globe,
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
  SidebarMenuSub,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { logout } from "@/services/auth/service/authService";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { openCustomerPortal } from "@/services/stripe/service/stripeService";
import { useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
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
    <Sidebar collapsible="icon" className="bg-blue-700 border-r-0">
      <SidebarHeader className="hidden md:block bg-blue-700">
        <SidebarTrigger className="text-white hover:bg-blue-700" />
      </SidebarHeader>
      <SidebarContent className="bg-blue-700">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-semibold">
            FIRERP
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-white hover:bg-white hover:text-blue-800 data-[state=open]:bg-blue-700">
                      <DollarSign className="ml-[4px] mr-[4px]" />
                      Stripe
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="/stripe/products">
                        <SidebarMenuButton
                          className={`text-white ml-4 ${
                            isActive("/stripe/products")
                              ? "bg-blue-600 hover:bg-blue-600"
                              : "hover:bg-white hover:text-blue-800"
                          }`}
                        >
                          <Box />
                          Products
                        </SidebarMenuButton>
                      </a>
                      <a
                        onClick={() => {
                          openCustomerPortal();
                        }}
                      >
                        <SidebarMenuButton className="text-white hover:bg-white hover:text-blue-800 ml-4">
                          <Globe />
                          Portal
                        </SidebarMenuButton>
                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
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
