import {
  Briefcase,
  Calendar,
  FileText,
  LayoutDashboard,
  Monitor,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
    badge: "3",
  },
  {
    title: "Resources",
    url: "/resources",
    icon: FileText,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Briefcase,
    badge: "8",
  },
  // {
  //   title: "Jobs",
  //   url: "#",
  //   icon: Users,
  //   badge: "New",
  // },
  // {
  //   title: "Alumni",
  //   url: "#",
  //   icon: GraduationCap,
  // },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-2">
            <Link href={"/"} className="w-full">
              <div className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors py-2 border-b-2 w-full ">
                <Monitor className="h-8 w-8" />
                <span className="font-bold text-xl">TechClub</span>
              </div>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="">{item.title}</span>
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
