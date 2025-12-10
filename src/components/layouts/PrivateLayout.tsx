import { cn } from "@/lib/utils";
import { AppSidebar } from "../Sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <>
      {!open && <SidebarTrigger className="absolute top-4 left-2 z-50" />}
      <div
        className={cn(
          "flex flex-col h-full w-full",
          open ? "p-2" : "pl-10 pt-2 pb-2 pr-2"
        )}
      >
        {children}
      </div>
    </>
  );
}

export function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className={cn(
          "relative bg-[var(--sidebar)] !overflow-hidden",
          "min-h-svh h-svh flex flex-col"
        )}
      >
        <LayoutContent>{children}</LayoutContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
