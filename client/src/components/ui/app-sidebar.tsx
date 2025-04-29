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
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { logout } from "@/services/auth/service/authService";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

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
    url: "login",
    icon: LucideLogOut,
    onClick: () => {
      logout();
    },
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="hidden md:block">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>FirERP</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <DollarSign />
                    Stripe
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <a href="/stripe/products">
                      <SidebarMenuSubItem className="flex items-center">
                        <Box className="w-5 h-5 mr-2" />
                        Products
                      </SidebarMenuSubItem>
                    </a>
                    <a href="/stripe/portal">
                      <SidebarMenuSubItem className="flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Portal
                      </SidebarMenuSubItem>
                    </a>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} onClick={item.onClick && item.onClick}>
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
