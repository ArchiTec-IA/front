import { Multiple, Unique } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { setMode, type ChatMode } from "@/store/chatSlice";

interface ModeSelectionComponentProps {
  isLoading: boolean;
  isListening: boolean;
}

export function ModeSelectionComponent({
  isLoading,
  isListening,
}: ModeSelectionComponentProps) {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const { mode } = chatState;

  const handleSetMode = (newMode: ChatMode) => {
    if (newMode === mode) return;
    dispatch(setMode(newMode));
  };
  return (
    <div className="p-4 mb-2 border border-gray-300 rounded-lg flex justify-center gap-4 h-[30%] dark:bg-gray-800">
      <h2 className="text-lg font-normal">Modo:</h2>
      <Button
        onClick={() => handleSetMode("single")}
        variant={mode === "single" ? "default" : "outline"}
        className={cn(
          mode === "single" ? "text-black " : "text-gray-400",
          "flex flex-col items-center gap-2 h-[100%] w-[35%] text-lg hover:cursor-pointer bg-transparent hover:bg-gray-200 border-none"
        )}
        disabled={isLoading || isListening}
      >
        Orçamento Único
        <Unique
          className={cn(
            "!h-20 !w-20",
            mode === "single" ? "text-black" : "text-gray-400"
          )}
        />
        <span className="text-sm text-gray-500">(Único ambiente ou item)</span>
      </Button>
      <Button
        onClick={() => handleSetMode("multiple")}
        variant={mode === "multiple" ? "default" : "outline"}
        className={cn(
          mode === "multiple" ? "text-black " : "text-gray-400",
          "flex flex-col items-center gap-2 h-[100%] w-[35%] text-lg hover:cursor-pointer bg-transparent hover:bg-gray-200 border-none"
        )}
        disabled={isLoading || isListening}
      >
        Múltiplos Itens
        <Multiple
          className={cn(
            "!h-20 !w-20",
            mode === "multiple" ? "text-black" : "text-gray-400"
          )}
        />
        <span className="text-sm text-gray-500">
          (Vários ambientes ou itens)
        </span>
      </Button>
    </div>
  );
}
