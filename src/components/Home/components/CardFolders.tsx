import { Files } from "@/assets/Files";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FolderCardProps = {
  className?: string;
  projectLength?: number;
};

export function CardFolders({ className, projectLength }: FolderCardProps) {
  return (
    <Card
      className={cn(
        className,
        "max-w-60 min-w-60 h-52 bg-transparent flex flex-col relative justify-center items-center p-0 overflow-hidden hover:cursor-pointer border-none shadow-none"
      )}
      onClick={() => console.log("Abrir Prajeira: ")}
    >
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <Files />
      </CardContent>
      <CardFooter className="p-4 w-full bg-gray-300  mt-auto absolute bottom-0 left-0 right-0 shadow-[0_-4px_12px_rgba(0,0,0,0.25)]">
        <div className="w-full">
          <h1 className="font-bold">Titulo</h1>
          <p>{projectLength ? projectLength : "0 projetos"}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
