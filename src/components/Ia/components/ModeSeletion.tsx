import { Multiple, Unique } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { setMode, type ChatMode } from "@/store/chatSlice";

interface ModeSelectionComponentProps {
  isLoading: boolean;
  isListening?: boolean;
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
    <div className="w-50 ml-5 mt-5 rounded-full flex justify-center gap-4 bg-sidebar">
      <Button
        onClick={() => handleSetMode("single")}
        variant={mode === "single" ? "outline" : null}
        className={cn(
          mode === "single"
            ? "text-foreground rounded-full w-[30%]"
            : "text-foreground w-[61.5%]  hover:cursor-pointer"
        )}
        disabled={isLoading || isListening}
      >
        {mode === "single" ? (
          <Unique
            className={cn(
              "!h-5 !w-5",
              mode === "single" ? "text-foreground" : "text-foreground"
            )}
          />
        ) : (
          <span>Detalhado</span>
        )}
      </Button>
      <Button
        onClick={() => handleSetMode("multiple")}
        variant={mode === "multiple" ? "outline" : null}
        className={cn(
          mode === "multiple"
            ? "text-foreground rounded-full w-[30%]"
            : "text-foreground  w-[61.5%] hover:cursor-pointer"
        )}
        disabled={isLoading || isListening}
      >
        {mode === "multiple" ? (
          <Multiple
            className={cn(
              "!h-5 !w-5",
              mode === "multiple" ? "text-foreground" : "text-foreground"
            )}
          />
        ) : (
          <span>Unico</span>
        )}
      </Button>
    </div>
  );
}
