import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FilterBadge {
  id: "recent" | "saved" | "planned";
  title: string;
  onClick: () => void;
  isActive: boolean;
  icon: ReactNode;
}

interface BadgeFilterProps {
  filters: FilterBadge[];
  className?: string;
}

export function BadgeFilter({ filters, className }: BadgeFilterProps) {
  const getFilterConfig = (filterId: "recent" | "saved" | "planned") => {
    const config = {
      saved: {
        active: "bg-blue-500 hover:bg-blue-600 text-white hover:cursor-pointer",
        inactive:
          "border-blue-100 text-blue-700 hover:bg-blue-200 bg-blue-100 hover:cursor-pointer hover:text-blue-500",
      },
      recent: {
        active:
          "bg-green-500 hover:bg-green-600 text-white hover:cursor-pointer",
        inactive:
          "border-green-100 bg-green-100 text-green-700 hover:text-green-500 hover:bg-green-100 hover:cursor-pointer",
      },
      planned: {
        active: "bg-lime-500 hover:bg-lime-600 text-white hover:cursor-pointer",
        inactive:
          "border-lime-100 text-lime-500 hover:bg-lime-200 bg-lime-100 hover:cursor-pointer hover:text-lime-500",
      },
    };

    return config[filterId];
  };
  return (
    <div className={cn("flex flex-wrap gap-8", className)}>
      {filters.map((filter) => {
        const config = getFilterConfig(filter.id);
        return (
          <Button
            key={filter.id}
            variant={filter.isActive ? "default" : "outline"}
            size="sm"
            onClick={filter.onClick}
            className={cn(
              "rounded-full font-bold transition-all flex items-center justify-center",
              filter.isActive ? config.active : config.inactive
            )}
          >
            <span>{filter.icon}</span>
            {filter.title}
          </Button>
        );
      })}
    </div>
  );
}
