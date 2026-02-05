import { cn } from "@/lib/utils";
import { CardFolders } from "./components/CardFolders";
import { CardItem } from "./components/CardItem";
import { CreateCardComponent } from "./components/CreateProjectCard";
import { HomeHeader } from "./components/HomePageHeader";
import { useAppSelector } from "@/hooks/hooks";

export function HomePageComponent() {
  const { projects } = useAppSelector((state) => state.projects);

  return (
    <div className="flex w-full flex-1 flex-col gap-6 items-center rounded-xl bg-background border-none">
      <div className="w-full flex flex-col items-center sticky top-0 z-10 bg-background backdrop-blur-sm pt-6 pb-2">
        <HomeHeader />
      </div>
      <div
        className={cn("flex flex-col w-full p-4 gap-6 overflow-y-auto flex-1")}
      >
        <div className="flex flex-row w-full gap-6">
          <CreateCardComponent className="" />
          {projects.map((project) => (
            <CardItem description={project.client} title={project.name} />
          ))}
        </div>
        <div className="flex flex-col w-full gap-6">
          <h1>Pastas</h1>
          <CardFolders />
        </div>
      </div>
    </div>
  );
}
