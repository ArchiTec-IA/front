"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

export function NavMain({
  items,
  open,
}: {
  open?: boolean;
  items: {
    title: string;
    url: string;
    icon?: ReactNode;
  }[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Geral</SidebarGroupLabel>
      <SidebarMenu className="w-full flex flex-col gap-1 items-center justify-center">
        {items.map((item) => {
          return (
            <SidebarMenuItem
              key={item.title}
              onClick={() => handleNavigation(item.url)}
              className={cn(
                !open
                  ? "w-[75%] justify-center flex gap-2 items-center p-1 rounded-full hover:cursor-pointer hover:bg-muted"
                  : "p-1 justify-start flex gap-2 items-center rounded-md w-full hover:cursor-pointer hover:bg-muted",
                isActive(item.url) && "bg-primary-foreground"
              )}
            >
              {item.icon && <span>{item.icon}</span>}
              {open && (
                <p
                  className={`${
                    isActive(item.url) && "font-bold"
                  }text-md font-normal`}
                >
                  {item.title}
                </p>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
