"use client";

import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import * as React from "react";

import { AiFileIcon, FoldersIcon, HomeIcon } from "@/assets/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { SideBarHeader } from "./side-bar-header";
import { cn } from "@/lib/utils";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inicio",
      url: "/home",
      icon: <HomeIcon className="!h-6 !w-6" />,
    },
    {
      title: "Pastas",
      url: "/folders",
      icon: <FoldersIcon className="!h-6 !w-6" />,
    },
    {
      title: "ArchiAi",
      url: "/ia",
      icon: <AiFileIcon className="!h-6 !w-6" />,
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div
          className={cn(
            open
              ? "flex items-center justify-center"
              : "flex items-center justify-center w-full"
          )}
        >
          <SideBarHeader isCollapsed={open} />
          {open && <SidebarTrigger />}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} open={open} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isOpen={open} />
      </SidebarFooter>
    </Sidebar>
  );
}
