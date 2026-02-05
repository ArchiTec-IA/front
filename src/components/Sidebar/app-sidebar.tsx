"use client";

import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Moon,
  Sun,
} from "lucide-react";
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
import { Button } from "../ui/button";
import { useTheme } from "@/providers/theme-provider";

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
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
        <div className="w-full flex items-center justify-center">
          <Button
            variant={"ghost"}
            size="icon"
            className="hover:cursor-pointer dark:hover:bg-transparent flex items-center justify-center bg-transparent rounded-sm p-2"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-gray-500 dark:text-white" />
            ) : (
              <Moon className="h-5 w-5 text-gray-500" />
            )}
          </Button>
        </div>

        <NavUser isOpen={open} />
      </SidebarFooter>
    </Sidebar>
  );
}
