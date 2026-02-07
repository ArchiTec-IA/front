"use client";

import { QuioLogo } from "@/assets/icons";

interface CompanyHeaderProps {
  isCollapsed: boolean;
}

const CompanyLogo = () => (
  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
    <QuioLogo className="w-6 h-6 text-accsent-foreground" />
  </div>
);

export function SideBarHeader({ isCollapsed }: CompanyHeaderProps) {
  return (
    <div className="flex w-full items-center justify-center gap-3">
      {isCollapsed ? (
        <div className="flex min-w-0 justify-start items-center gap-3 w-full">
          <CompanyLogo />
          <span className="font-sm text-lg truncate mt-2">Boa Vista</span>
        </div>
      ) : (
        <CompanyLogo />
      )}
    </div>
  );
}
