"use client";

interface CompanyHeaderProps {
  isCollapsed: boolean;
}

const CompanyLogo = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-fuchsia-400 rounded-lg flex items-center justify-center flex-shrink-0">
    <span className="text-white font-bold text-sm">A</span>
  </div>
);

export function SideBarHeader({ isCollapsed }: CompanyHeaderProps) {
  return (
    <div className="flex w-full items-center justify-center gap-3">
      {isCollapsed ? (
        <div className="flex min-w-0 justify-start items-center gap-3 w-full">
          <CompanyLogo />
          <span className="font-bold text-lg truncate mt-2">ArchiTec</span>
        </div>
      ) : (
        <CompanyLogo />
      )}
    </div>
  );
}
