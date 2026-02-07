import { AddFileArt } from "@/assets/AddFile";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { setIsOpenModal } from "@/store/projectSlice";

type CreateCardProps = {
  className?: string;
};

export function CreateCardComponent({ className }: CreateCardProps) {
  const dispatch = useAppDispatch();
  return (
    <Card
      className={cn(
        className,
        "max-w-60 min-w-60 h-60 bg-accent flex justify-center items-center p-0 overflow-hidden hover:cursor-pointer border-2 border-slate-200 border-dashed",
      )}
      onClick={() => dispatch(setIsOpenModal(true))}
    >
      <CardContent className="flex gap-4 flex-col">
        <AddFileArt />
        <CardTitle>Criar Projeto</CardTitle>
      </CardContent>
    </Card>
  );
}
