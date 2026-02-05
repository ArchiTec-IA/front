import { NewProjectModal } from "@/components/New-project-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type HeaderProps = {
  className?: string;
};

export function HomeHeader({ className }: HeaderProps) {
  return (
    <div
      className={cn("w-full flex justify-between items-center px-3", className)}
    >
      <h1 className="text-2xl w-[60%]">Meus Projetos</h1>
      <div className="flex items-center flex-1 gap-2">
        <div className="relative w-full max-w-sm">
          <Input type="text" placeholder="Pesquisar..." className="pr-10" />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <NewProjectModal />
      </div>
    </div>
  );
}
