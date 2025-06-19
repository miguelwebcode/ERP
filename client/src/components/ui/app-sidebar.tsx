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
import { AppIcon, IconName } from "@/config/plugins/icons.plugin";

// Menu items.

type IconData = {
  title: string;
  url: string;
  icon: IconName;
  onClick?: () => void;
};
const items: IconData[] = [
  {
    title: "Home",
    url: "/",
    icon: "home",
  },
  {
    title: "Customers",
    url: "/customers",
    icon: "customers",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: "projects",
  },
  {
    title: "Employees",
    url: "/employees",
    icon: "employees",
  },
  {
    title: "Logout",
    url: "/login",
    icon: "logout",
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
          <SidebarGroupLabel>FIRERP</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <AppIcon name="stripe" />
                    Stripe
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <a href="/stripe/products">
                      <SidebarMenuButton>
                        <AppIcon name="stripeProducts" />
                        Products
                      </SidebarMenuButton>
                    </a>
                    <a
                      onClick={() => {
                        openCustomerPortal();
                      }}
                    >
                      <SidebarMenuButton>
                        <AppIcon name="stripePortal" />
                        Portal
                      </SidebarMenuButton>
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
                      <AppIcon name={item.icon} />
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
