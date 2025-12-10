import { ClockIcon, PlaningIcon, SaveIcon } from "@/assets/icons";
import { useFilter } from "@/hooks/useFilter";
import { BadgeFilter } from "./components/HomePageBadge";
import { HomeHeader } from "./components/HomePageHeader";
import { cn } from "@/lib/utils";
import { CardItem } from "./components/CardItem";
import { CreateCardComponent } from "./components/CreateProjectCard";
import { CardFolders } from "./components/CardFolders";

export function HomePageComponent() {
  const { activeFilter, handleFilterClick } = useFilter();

  const filters = [
    {
      id: "recent" as const,
      title: "Recentes",
      onClick: () => handleFilterClick("recent"),
      isActive: activeFilter === "recent",
      icon: (
        <ClockIcon
          className={cn(
            "text-green-500 !h-5 !w-5",
            activeFilter === "recent" && "text-white"
          )}
        />
      ),
    },
    {
      id: "saved" as const,
      title: "Salvos",
      onClick: () => handleFilterClick("saved"),
      isActive: activeFilter === "saved",
      icon: (
        <SaveIcon
          className={cn(
            "text-blue-500 !h-5 !w-5",
            activeFilter === "saved" && "text-white"
          )}
        />
      ),
    },
    {
      id: "planned" as const,
      title: "Planejando",
      onClick: () => handleFilterClick("planned"),
      isActive: activeFilter === "planned",
      icon: (
        <PlaningIcon
          className={cn(
            "text-lime-500 !h-5 !w-5",
            activeFilter === "planned" && "text-white"
          )}
        />
      ),
    },
  ];
  return (
    <div className="flex w-full flex-1 flex-col gap-6 items-center rounded-lg bg-white border-slate-400">
      <div className="w-full flex flex-col items-center sticky top-0 z-10 bg-white/95 backdrop-blur-sm pt-6 pb-2">
        <HomeHeader />
        <div className="flex-1 w-full px-3">
          <BadgeFilter filters={filters} className="mb-4" />
        </div>
      </div>
      <div
        className={cn("flex flex-col w-full p-4 gap-6 overflow-y-auto flex-1")}
      >
        <div className="flex flex-row w-full gap-6">
          <CreateCardComponent className="" />
          <CardItem description="descrição exemplo" title="Titulo exemplo" />
        </div>
        <div className="flex flex-col w-full gap-6">
          <h1>Pastas</h1>
          <CardFolders />
        </div>
      </div>
    </div>
  );
}
