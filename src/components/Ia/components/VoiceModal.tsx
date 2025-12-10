import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceModalProps {
  isOpen: boolean;
  onStop: () => void;
  message?: string;
  transcript?: string;
}

export function VoiceModal({
  isOpen,
  onStop,
  message = "Ouvindo...",
  transcript,
}: VoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-card p-8 rounded-xl shadow-2xl flex flex-col items-center gap-6">
        {/* Animação de Voz */}
        <div className="relative size-24 flex items-center justify-center">
          {/* Animação simples de pulsação */}
          <div
            className={cn(
              "absolute inset-0 border-4 rounded-full border-primary opacity-70",
              "animate-ping-slow"
            )}
          />
          <Mic className="size-10 text-primary z-10" />
        </div>

        <p className="text-xl font-semibold text-foreground">{message}</p>

        {transcript && (
          <div className="bg-muted p-3 rounded-lg w-full max-w-sm text-center">
            <p className="text-sm italic">Transcrição em tempo real:</p>
            <p className="font-medium text-lg">{transcript}</p>
          </div>
        )}

        <Button onClick={onStop} variant="destructive" className="mt-4">
          <StopCircle className="size-5 mr-2" />
          Parar Gravação
        </Button>
      </div>
    </div>
  );
}
